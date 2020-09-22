import React, { CSSProperties } from 'react';
import { Select, Spin } from 'antd';
import debounce from 'lodash/debounce';

const { Option } = Select;

export type SearchProps = {
  fetchOption?: (params: any) => Promise<any>;
  getParams?: (params: any) => any;
  getOption?: (params: any) => any;
  onChange?: (params: any) => any;
  mode?: 'multiple' | 'tags' | undefined;
  placeholder?: string;
  itemStyle?: CSSProperties;
};

export default class UserRemoteSelect extends React.Component<SearchProps> {
  lastFetchId: number;

  constructor(props: SearchProps) {
    super(props);
    this.lastFetchId = 0;
    this.fetchUser = debounce(this.fetchUser, 800);
  }

  state = {
    data: [],
    value: [],
    fetching: false,
  };

  fetchUser = (value: string) => {
    const { fetchOption, getParams, getOption } = this.props;
    this.lastFetchId += 1;
    const fetchId = this.lastFetchId;
    this.setState({ data: [], fetching: true });
    const params = getParams && getParams(value);
    if (fetchOption) {
      fetchOption(params).then((body: any) => {
        if (fetchId !== this.lastFetchId) {
          // for fetch callback order
          return;
        }
        const data = getOption && getOption(body);
        this.setState({ data, fetching: false });
      });
    }
  };

  handleChange = (value: any) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(value);
    }
    this.setState({
      value,
      data: [],
      fetching: false,
    });
  };

  render() {
    const { fetching, data, value } = this.state;
    const { mode, placeholder, itemStyle } = this.props;
    return (
      <Select
        mode={mode}
        labelInValue
        value={value}
        placeholder={placeholder}
        notFoundContent={fetching ? <Spin size="small" /> : null}
        filterOption={false}
        onSearch={this.fetchUser}
        onChange={this.handleChange}
        style={itemStyle}
        showSearch
      >
        {data.map((item: any) => (
          <Option key={item.value || item} value={item.value || item}>
            {item.key || item}
          </Option>
        ))}
      </Select>
    );
  }
}
