import React from 'react';
import renderer from 'react-test-renderer';

import SelectOptionList from '../SelectOptionList';

const defaultProps = {
    dataSource: [
        { key: 1, value: "OW Sports" },
        { key: 2, value: "OW Number Game" }
    ],
    id: 1,
    onChange: jest.fn()
}

describe('SelectOptionList ', () => {
    it('rendered content should match with snapshot', () => {
        const dataSource = [{
            key: "key1",
            value: "Value 1"
        },
        {
            key: "key2",
            value: "Value 2"
        }
        ];

        const props = Object.assign({}, defaultProps, { dataSource });
        const optionList = renderer.create(<SelectOptionList {...props} />);

        const result = optionList.toJSON();

        expect(result).toMatchSnapshot();
    })

    it('componentWillUnmount - should call removeEventListener', () => {
        const optionList = renderer.create(<SelectOptionList {...defaultProps} />);
        const instance = optionList.getInstance();
        document.removeEventListener = jest.fn();

        instance.componentWillUnmount()

        expect(document.removeEventListener).toHaveBeenCalled();
    })

    it('componentDidUpdate - should call setState', () => {
        const prevProps = { ...defaultProps, dataSource: [] };
        const optionList = renderer.create(<SelectOptionList {...defaultProps} />);
        const instance = optionList.getInstance();
        instance.setState({ selectedOption: { current: { classList: { remove: jest.fn() } } } });
        instance.setState = jest.fn();
        instance.selectOptionsRef = { current: { scrollTop: 123 } };

        instance.componentDidUpdate(prevProps)

        expect(instance.setState).toHaveBeenCalled();
    })

    it('handleMouseOver - invalid event', () => {
        const selectedOption = { current: { classList: { remove: jest.fn() } } }
        const optionList = renderer.create(<SelectOptionList {...defaultProps} />);
        const instance = optionList.getInstance();
        instance.setState({ selectedOption });
        instance.selectOptionsRef = { current: { innerHTML: "abc123" } };

        instance.handleMouseOver({ target: { outerHTML: "xyz" }})

        expect(selectedOption.current.classList.remove).not.toHaveBeenCalled();
    })

    it('handleMouseOver - valid event', () => {
        const selectedOption = { current: { classList: { remove: jest.fn() } } }
        const optionList = renderer.create(<SelectOptionList {...defaultProps} />);
        const instance = optionList.getInstance();
        instance.setState({ selectedOption });
        instance.setState = jest.fn();
        instance.selectOptionsRef = { current: { innerHTML: "abc123" } };
        instance.optionRefs = [{ current: { outerHTML: "123" } }]

        instance.handleMouseOver({ target: { outerHTML: "c12" } })

        expect(selectedOption.current.classList.remove).toHaveBeenCalled();
        expect(instance.setState).not.toHaveBeenCalled();
    })

    it('handleMouseOver - valid event and call setState', () => {
        const selectedOption = { current: { classList: { remove: jest.fn() } } }
        const optionList = renderer.create(<SelectOptionList {...defaultProps} />);
        const instance = optionList.getInstance();
        instance.setState({ selectedOption });
        instance.setState = jest.fn();
        instance.selectOptionsRef = { current: { innerHTML: "abc123" } };
        instance.optionRefs = [{ current: { outerHTML: "abc" } }, { current: { outerHTML: "123", classList: { add: jest.fn() }} }]

        instance.handleMouseOver({ target: { outerHTML: "123" } })

        expect(selectedOption.current.classList.remove).toHaveBeenCalled();
        expect(instance.setState).toHaveBeenCalled();
    })

    it('handleKeyPress - invalid target', () => {
        const optionList = renderer.create(<SelectOptionList {...defaultProps} />);
        const instance = optionList.getInstance();
        instance.setState = jest.fn();

        instance.handleKeyPress({ target: { name: "123" }, keyCode: 123 })

        expect(instance.setState).not.toHaveBeenCalled();
    })

    it('handleKeyPress - valid target - press up but selectedOption is null', () => {
        const optionList = renderer.create(<SelectOptionList {...defaultProps} />);
        const instance = optionList.getInstance();
        instance.setState = jest.fn();

        instance.handleKeyPress({ target: { name: "inputOption" }, keyCode: 38 })

        expect(instance.setState).not.toHaveBeenCalled();
    })

    it('handleKeyPress - valid target - press up and selectedOption is not null', () => {
        const selectedOption = { current: { classList: { remove: jest.fn() }, offsetHeight: 12 } }
        const optionList = renderer.create(<SelectOptionList {...defaultProps} />);
        const instance = optionList.getInstance();
        instance.setState({ selectedOption, selectedIndex: 1, minLength: 0, maxLength: 2 });
        instance.setState = jest.fn();
        instance.selectOptionsRef = { current: { scrollTop: 123 } };
        instance.optionRefs = [{ current: { innerHTML: "abc", classList: { add: jest.fn() } } }, { current: { innerHTML: "123" } }]

        instance.handleKeyPress({ target: { name: "inputOption" }, keyCode: 38 })

        expect(selectedOption.current.classList.remove).toHaveBeenCalled();
        expect(instance.setState).toHaveBeenCalled();
    })

    it('handleKeyPress - valid target - press up, selectedOption is not null and selectedIndex is 0 ', () => {
        const selectedOption = { current: { classList: { remove: jest.fn() }, offsetHeight: 12 } }
        const optionList = renderer.create(<SelectOptionList {...defaultProps} />);
        const instance = optionList.getInstance();
        instance.setState({ selectedOption, selectedIndex: 0, minLength: 0, maxLength: 2 });
        instance.setState = jest.fn();
        instance.selectOptionsRef = { current: { scrollTop: 123 } };
        instance.optionRefs = [{ current: { innerHTML: "abc", classList: { add: jest.fn() } } }, { current: { innerHTML: "123" } }]

        instance.handleKeyPress({ target: { name: "inputOption" }, keyCode: 38 })

        expect(selectedOption.current.classList.remove).not.toHaveBeenCalled();
        expect(instance.setState).not.toHaveBeenCalled();
    })

    it('handleKeyPress - valid target and press down but selectedOption is null', () => {
        const optionList = renderer.create(<SelectOptionList {...defaultProps} />);
        const instance = optionList.getInstance();
        instance.setState = jest.fn();
        instance.selectOptionsRef = { current: { innerHTML: "abc123" } };
        instance.optionRefs = [{ current: { innerHTML: "123", classList: { add: jest.fn() } } }, { current: { innerHTML: "abc" } }]

        instance.handleKeyPress({ target: { name: "inputOption" }, keyCode: 40 })

        expect(instance.setState).toHaveBeenCalled();
    })

    it('handleKeyPress - valid target and press down but selectedOption is not null', () => {
        const selectedOption = { current: { classList: { remove: jest.fn() }, offsetHeight: 12 } }
        const optionList = renderer.create(<SelectOptionList {...defaultProps} />);
        const instance = optionList.getInstance();
        instance.setState({ selectedOption, selectedIndex: 0, minLength: 0, maxLength: 2 });
        instance.setState = jest.fn();
        instance.selectOptionsRef = { current: { innerHTML: "abc123" } };
        instance.optionRefs = [{ current: { innerHTML: "abc" } }, { current: { innerHTML: "123", classList: { add: jest.fn() } } }]

        instance.handleKeyPress({ target: { name: "inputOption" }, keyCode: 40 })

        expect(selectedOption.current.classList.remove).toHaveBeenCalled();
        expect(instance.setState).toHaveBeenCalled();
    })

    it('handleKeyPress - valid target and press enter', () => {
        const selectedOption = { current: { classList: { remove: jest.fn() } } }
        const props = { ...defaultProps, onChange: jest.fn() }
        const optionList = renderer.create(<SelectOptionList {...props} />);
        const instance = optionList.getInstance();
        instance.setState({ selectedOption });
        instance.setState = jest.fn();

        instance.handleKeyPress({ target: { name: "inputOption" }, keyCode: 13 })

        expect(instance.setState).not.toHaveBeenCalled();
        expect(selectedOption.current.classList.remove).toHaveBeenCalled();
        expect(props.onChange).toHaveBeenCalled();
    })

    it('handleKeyPress - valid target and press other keys', () => {
        const selectedOption = { current: { classList: { remove: jest.fn() } } }
        const props = { ...defaultProps, onChange: jest.fn() }
        const optionList = renderer.create(<SelectOptionList {...props} />);
        const instance = optionList.getInstance();
        instance.setState({ selectedOption });
        instance.setState = jest.fn();

        instance.handleKeyPress({ target: { name: "inputOption" }, keyCode: 123 })

        expect(instance.setState).not.toHaveBeenCalled();
        expect(selectedOption.current.classList.remove).not.toHaveBeenCalled();
        expect(props.onChange).not.toHaveBeenCalled();
    })
})