import PropTypes from 'prop-types';
import React from 'react';

import {Semantic} from 'packages/components';

const options = [
    {key: 'de', value: 'de', flag: 'de', text: 'Deutsch'},
    {key: 'en', value: 'en', flag: 'gb', text: 'English'},
];

const LocaleSwitcher = ({locale, onChange, className}) => (
    <Semantic.Dropdown
        className={className}
        pointing="top left"
        options={options}
        value={locale}
        onChange={(e, {value}) => onChange(value)}
    />
);

LocaleSwitcher.propTypes = {
    locale: PropTypes.string.isRequired,
    className: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default LocaleSwitcher;
