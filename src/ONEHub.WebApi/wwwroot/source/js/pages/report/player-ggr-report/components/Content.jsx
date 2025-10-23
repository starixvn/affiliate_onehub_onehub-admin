import React, { Component } from "react";

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import GridData from './GridData';
import ReportTitle from '../../../../components/ReportTitle';

import { toggleLoader } from '../../../../actions/loaderAction';
import ReportExcel from '../libs/reportExcel';
import { fetchData } from '../actions';
import { maxPageSize } from '../libs/constants';

export class Content extends Component {
    constructor(props) {
        super(props);
        this.state = {
            exportProgress: null,
            exportStatus: null,
            isExporting: false
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        const { reportTitle } = this.props;
        const { exportProgress, exportStatus, isExporting } = this.state;

        return nextProps.reportTitle !== reportTitle || 
               nextState.exportProgress !== exportProgress ||
               nextState.exportStatus !== exportStatus ||
               nextState.isExporting !== isExporting;
    }

    handleExportExcel = async () => {
        if (this.state.isExporting) {
            alert('Export is already in progress. Please wait...');
            return;
        }

        this.setState({ isExporting: true });
        this.props.toggleLoader(true);
        const { param, reportTitle, productList, pagingOption } = this.props;
        const selectedProducts = productList.filter(p => p.checked);
        
        try {            
            if (!pagingOption.TotalItem) {
                alert('No data to export');
                return;
            }

            const totalRecords = pagingOption.TotalItem;
            
            await this.handlePaginatedExport(param, reportTitle, selectedProducts, totalRecords);
        } catch (error) {
            alert('Export failed. Please try again or contact support.');
        } finally {
            this.setState({ 
                isExporting: false,
                exportProgress: null,
                exportStatus: null 
            });
            this.props.toggleLoader(false);
        }
    }

    handlePaginatedExport = async (param, reportTitle, selectedProducts, totalRecords) => {
        const chunks = Math.ceil(totalRecords / maxPageSize);
        let allData = [];
        let totalData = null;
        
        this.setState({ 
            exportProgress: 0, 
            exportStatus: `Preparing to export ${totalRecords.toLocaleString()} records using pagination...` 
        });
        
        for (let i = 0; i < chunks; i++) {
            const chunkParam = Object.assign({}, param, {
                IsExportExcel: true,
                PageIndex: i + 1,
                PageSize: maxPageSize
            });
            
            this.setState({ 
                exportStatus: `Fetching page ${i + 1} of ${chunks} (${maxPageSize} records per page)...`
            });
            
            const chunkData = await this.props.fetchData(chunkParam);
            
            if (chunkData && chunkData.MainData) {
                allData = allData.concat(chunkData.MainData);
                
                if (i === 0) {
                    totalData = chunkData.Total;
                }
                
                const progress = Math.round(((i + 1) / chunks) * 100);
                this.setState({ 
                    exportProgress: progress,
                    exportStatus: `Downloaded ${allData.length.toLocaleString()} of ${totalRecords.toLocaleString()} records (Page ${i + 1}/${chunks})...`
                });
            }
            
            if (i < chunks - 1) {
                await new Promise(resolve => setTimeout(resolve, 150));
            }
        }
        
        this.setState({ 
            exportStatus: 'Generating Excel file...' 
        });
        
        const combinedData = {
            MainData: allData,
            Total: totalData,
            TotalItem: totalRecords
        };
        
        if (!allData || allData.length === 0) {
            throw new Error('No data available for export');
        }
        
        if (!selectedProducts || selectedProducts.length === 0) {
            throw new Error('No products selected for export');
        }
        
        try {
            const reportExcel = new ReportExcel(combinedData, reportTitle, selectedProducts);
            
            // Check if this will be a multi-sheet export
            const estimatedCells = allData.length * (6 + selectedProducts.length * 2); // Rough calculation
            const willBeMultiFile = allData.length > 10000 || estimatedCells > 1500000;
            
            if (willBeMultiFile) {
                this.setState({ 
                    exportStatus: 'Large dataset detected. Generating Excel file with multiple sheets...' 
                });
            }
            
            await reportExcel.export();
            
            if (willBeMultiFile) {
                alert('Export completed! Excel file with multiple sheets has been downloaded due to the large dataset size.');
            }
        } catch (excelError) {
            throw new Error(`Excel generation failed: ${excelError.message}`);
        }
        
        this.setState({ 
            exportProgress: null, 
            exportStatus: null 
        });
    }

    _buildReportTitle() {
        const { reportTitle } = this.props;
        const { isExporting } = this.state;

        return (
            <div className="d-flex align-items-center">
                {reportTitle}
                <button 
                    type="button" 
                    className={`ml-auto btn btn-link btn-excel ${isExporting ? 'disabled' : ''}`}
                    onClick={this.handleExportExcel} 
                    disabled={isExporting}
                    title={isExporting ? "Export in progress..." : "Export Excel"}>
                    <span className={`oi ${isExporting ? 'oi-clock' : 'icon-excel'}`}></span>
                    {isExporting && <span className="ml-1">Exporting...</span>}
                </button>
            </div>
        )
    }

    render() {
        const { reportTitle } = this.props;
        const { exportProgress, exportStatus } = this.state;

        return (
            <div className="data-content my-2 report-content-container">
                {
                    reportTitle && (
                        <ReportTitle content={this._buildReportTitle()} />
                    )
                }
                {
                    exportProgress !== null && (
                        <div className="export-progress-container mb-3 p-3 bg-light border rounded">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <span className="font-weight-bold">Excel Export Progress</span>
                                <span className="badge badge-info">{exportProgress}%</span>
                            </div>
                            <div className="progress mb-2">
                                <div 
                                    className="progress-bar progress-bar-striped progress-bar-animated" 
                                    role="progressbar" 
                                    style={{ width: `${exportProgress}%` }}
                                    aria-valuenow={exportProgress} 
                                    aria-valuemin="0" 
                                    aria-valuemax="100">
                                </div>
                            </div>
                            <small className="text-muted">{exportStatus}</small>
                        </div>
                    )
                }
                <GridData />
            </div>
        );
    }
}

function mapStateToProps({ reportTitle, param, productList, pagingOption }) {
    return Object.assign({}, { reportTitle, param, productList, pagingOption });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ toggleLoader, fetchData }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Content);