import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import RIEStatefulBase from './RIEStatefulBase';

export default class RIESelect extends RIEStatefulBase {
    static propTypes = {
        options: PropTypes.array.isRequired
    };

    finishEditing = () => {
        // get the object from options that matches user selected value
        const newValue = this.props.options.find(function(option) {
            return option.id === ReactDOM.findDOMNode(this.refs.input).value;
        }, this);
        this.doValidations(newValue);
        if(!this.state.invalid && this.props.value !== newValue) {
            this.commit(newValue);
        }
        this.cancelEditing();
    };

    renderEditingComponent = () => {
        const optionNodes = this.props.options.map(function(option) {
            return <option value={option.id} key={option.id}>{option.text}</option>
        });

        return <select disabled={(this.props.shouldBlockWhileLoading && this.state.loading)}
                       value={this.props.value.id}
                       className={this.makeClassString()}
                       onChange={this.finishEditing}
                       onBlur={this.cancelEditing}
                       ref="input"
                       onKeyDown={this.keyDown}
                       {...this.props.editProps}>{optionNodes}</select>
    };

    renderNormalComponent = () => {
        let value = null;
        if(!!this.state.newValue) {
            value = this.state.newValue.text;
        } else {
            value = this.props.value.text;
        }
        value = this.renderValue(value);
        return <span
            tabIndex="0"
            className={this.makeClassString()}
            onFocus={this.startEditing}
            onClick={this.startEditing}
            {...this.props.defaultProps}>{value}</span>;
    };
}
