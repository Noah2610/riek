import React from 'react';
import PropTypes from 'prop-types';
import RIEStatefulBase from './RIEStatefulBase';

const debug = require('debug')('RIENumber');

export default class RIENumber extends RIEStatefulBase {

    constructor(props) {
        super(props);
    }

    static propTypes = {
        format: PropTypes.func
    };

    validate = (value) => {
        debug(`validate(${value})`)
        return !isNaN(value) && isFinite(value) && value.length > 0;
    };

    selectInputText = (element) => {
        debug(`selectInputText(${element})`)
        // element.setSelectionRange won't work for an input of type "number"
        setTimeout(function() { element.select(); }, 10);
    }

    elementBlur = (element) => {
        debug(`elementBlur(${element})`)
/*  
            Firefox workaround
            Found at https://tirdadc.github.io/blog/2015/06/11/react-dot-js-firefox-issue-with-onblur/
*/
        if (element.nativeEvent.explicitOriginalTarget &&
            element.nativeEvent.explicitOriginalTarget == element.nativeEvent.originalTarget) {
            return;
        }
        this.finishEditing();
    }

    renderNormalComponent = () => {
        debug(`renderNormalComponent()`)
        let value = null;
        if(this.props.format) {
            value = this.props.format(this.state.newValue || this.props.value);
        } else {
            value = this.state.newValue || this.props.value;
        }
        value = this.renderValue(value);
        return <span
            tabIndex="0"
            className={this.makeClassString()}
            onFocus={this.startEditing}
            onClick={this.elementClick}
            {...this.props.defaultProps}>{value}</span>;
    };

    renderEditingComponent = () => {
        debug(`renderEditingComponent()`)
        return <input disabled={(this.props.shouldBlockWhileLoading && this.state.loading)}
                      type="number"
                      className={this.makeClassString()}
                      defaultValue={this.props.value}
                      onInput={this.textChanged}
                      onBlur={this.elementBlur}
                      ref="input"
                      onKeyDown={this.keyDown}
                      {...this.props.editProps} />;
    };
}
