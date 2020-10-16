import React, { FC } from 'react';
import { Input, DatePicker, Select, Cascader, InputNumber } from 'antd';
import classNames from 'classnames';
import moment from 'moment';
import debounce from 'lodash/debounce';
import styles from './index.less';
import { FilterItemProps } from './interface';

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

const DFT_DATE_FORMAT = 'YYYY-MM-DD';

const cx = classNames.bind(styles);

interface FilterOptionProps {
  filters: Array<FilterItemProps>;
  setFilterOpts: (params: object) => void;
  defaultCondtions?: any;
}

const FilterOptions: FC<FilterOptionProps> = (props) => {
  const { setFilterOpts, filters = [], defaultCondtions = {} } = props;

  // eslint-disable-next-line no-shadow
  const changeRangeDate = (dates: Date[], filters: Array<string>) => {
    if (dates.length > 0) {
      setFilterOpts({
        [`${filters[0]}`]: `${moment(dates[0]).format(DFT_DATE_FORMAT)} 00:00:00`,
        [`${filters[1]}`]: `${moment(dates[1]).format(DFT_DATE_FORMAT)} 23:59:59`,
      });
    } else {
      setFilterOpts({
        [`${filters[0]}`]: '',
        [`${filters[1]}`]: '',
      });
    }
  };

  // eslint-disable-next-line no-shadow
  const handleCascaderChange = (options: any, filters: any) => {
    if (options.length > 0) {
      setFilterOpts({
        [`${filters[0]}`]: options[1].value,
        [`${filters[1]}`]: options[1].label,
      });
    } else {
      setFilterOpts({
        [`${filters[0]}`]: '',
        [`${filters[1]}`]: '',
      });
    }
  };

  const handleValueChange = (
    value: any,
    filter: string | string[] | undefined,
    filterType = 'string',
  ) => {
    const nValue = typeof value === 'string' ? value.trim() : value;

    if (filterType === 'array') {
      setFilterOpts({ [`${filter}`]: nValue ? [nValue] : [] });
    } else {
      setFilterOpts({ [`${filter}`]: nValue });
    }
  };
  const changeInput = debounce((value: any, filter: any) => {
    handleValueChange(value, filter);
  }, 300);

  const renderFilterItem = (item: FilterItemProps, index: number) => {
    const cls = cx(styles.mr16, item.className);
    const extraProps = item.extraProps ? { ...item.extraProps } : {};

    switch (item.type) {
      case 'inputNumber':
        return (
          <InputNumber
            key={`filter-${index}`}
            className={cls}
            style={{ width: item.width || 150, marginBottom: '20px' }}
            placeholder={item.placeholder}
            defaultValue={defaultCondtions ? defaultCondtions[item.filter as string] || '' : ''}
            onChange={(value?: string | number) => {
              changeInput(value, item.filter);
            }}
            onPressEnter={(e: any) => handleValueChange(e.target.value, item.filter)}
          />
        );
      case 'search':
        return (
          <Search
            key={`filter-${index}`}
            className={cls}
            style={{ width: item.width || 150, marginBottom: '20px' }}
            placeholder={item.placeholder}
            defaultValue={defaultCondtions ? defaultCondtions[item.filter as string] || '' : ''}
            onSearch={(value) => handleValueChange(value, item.filter)}
            onPressEnter={(e: any) => handleValueChange(e.target.value, item.filter)}
          />
        );
      case 'select':
        return (
          <Select
            mode={item.mode || ''}
            allowClear
            key={`filter-${index}`}
            className={cls}
            style={{ width: item.width || 150, marginBottom: '20px' }}
            placeholder={item.placeholder}
            {...extraProps}
            onChange={(value) => handleValueChange(value, item.filter, item.filterType)}
          >
            {item.options &&
              item.options.map((opt) => (
                <Option value={opt.value || ''} key={opt.value}>
                  {opt.label}
                </Option>
              ))}
          </Select>
        );
      case 'cascader':
        return (
          <Cascader
            className={cls}
            key={`filter-${index}`}
            options={item.options}
            placeholder={item.placeholder}
            style={{ width: item.width || 150, marginBottom: '20px' }}
            onChange={(value, options) => handleCascaderChange(options, item.filter)}
          />
        );
      case 'datepicker':
        return (
          <DatePicker
            key={`filter-${index}`}
            className={cls}
            style={{ width: item.width || 150, marginBottom: '20px' }}
            placeholder={item.placeholder}
            format="YYYY-MM-DD HH:mm:ss"
            onChange={(dates: any) => changeRangeDate(dates, item.filter as string[])}
          />
        );
      case 'rangepicker':
        return (
          <RangePicker
            key={`filter-${index}`}
            className={cls}
            style={{ width: item.width || 150, marginBottom: '20px' }}
            format={DFT_DATE_FORMAT}
            onChange={(dates: any) => changeRangeDate(dates, item.filter as string[])}
          />
        );
      default:
        return <div />;
    }
  };

  return <div>{filters.map((item, index: number) => renderFilterItem(item, index))}</div>;
};

export default FilterOptions;
