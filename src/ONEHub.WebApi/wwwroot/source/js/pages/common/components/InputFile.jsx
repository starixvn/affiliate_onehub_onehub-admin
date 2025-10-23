import React from 'react';
import PropTypes from 'prop-types';
import { Button, Input } from 'reactstrap';

export default class InputFile extends React.PureComponent {
    constructor(props) {
        super(props);

        this.inputRef = React.createRef();
    }

    componentDidUpdate(prevProps) {
        const { files } = this.props;

        if (!files.length && files !== prevProps.files) {
            //reset value to select the previous file again
            this.inputRef.current.value = null;
        }
    }

    handleClick = () => {
        this.inputRef.current.value = null;

        this.inputRef.current.click();
    }

    render() {
        const { className, files, isMultiple, handleOnChangeFiles, accept, btnName, lblText, id } = this.props;
        let text = lblText;

        if (files.length > 0) {
            text = files.length == 1 ? files[0].name : `${files.length} files`;
        }

        return (
            <React.Fragment>
                <div className={className} style={{ cursor: 'pointer' }} onClick={this.handleClick}>
                    <Button id={id} type="button">{btnName}</Button>
                    <span className="px-2" style={{ 'marginTop': '2px' }} title={text}>{text}</span>
                    <Input type="file"
                        name="file"
                        hidden
                        files={files}
                        multiple={isMultiple}
                        innerRef={this.inputRef}
                        onChange={handleOnChangeFiles}
                        accept={accept} />
                </div>
            </React.Fragment>
        )
    }
}

InputFile.propTypes = {
    files: PropTypes.array.isRequired,
    handleOnChangeFiles: PropTypes.func.isRequired,
    accept: PropTypes.string.isRequired,
    btnName: PropTypes.string,
    lblText: PropTypes.string,
    className: PropTypes.string,
    multiple: PropTypes.bool,
    id: PropTypes.string
};

InputFile.defaultProps = {
    id: 'upload-file-button',
    multiple: false,
    className: null,
    btnName: 'Choosen',
    lblText: 'No file choosen'
};