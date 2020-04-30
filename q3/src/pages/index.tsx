import React from 'react';
import styles from './index.less';
import { formatMessage, setLocale, getLocale } from 'umi-plugin-react/locale';
import AutoComplete from '@/components/autoComplete/input'


export interface LabeledValue {
  value: string;
  label: React.ReactNode | string;
  [proppName:string]:any;
}


export interface PageState {
  options: [LabeledValue?],
  locale: string
}

class Page extends React.Component<{}, PageState> {

  constructor (props: {}) {
    super(props)
    this.state = {
      locale: getLocale(),
      options: []
    }
  }

  // 切换语言
  changeLang = (key: string) => {
    setLocale(key)
    this.setState({
      locale: key
    })
  }

  // 根据输入内容检索 更新选项
  searchOptions = async (value: string) => {

    const options = await asycnFetchOptions(value)
   
    this.setState({
      options
    })
  }

  // 选中选项
  handleSelect = (value: string) => {
    console.log(value)
  }
  
  render() {
    const { options, locale } = this.state

    return (
      <div className={styles.normal}>
        <div className={styles.header}></div>

        <div className={styles.container}>
          <div className={styles.list}>
            <a className={`${locale === 'zh-CN' ? styles['locale-select'] : ''}`} onClick={() => this.changeLang('zh-CN')}>中文</a>
            <span> / </span>
            <a className={`${locale === 'en-US' ? styles['locale-select'] : ''}`} onClick={() => this.changeLang('en-US')}>英文</a>
          </div>
        
          <AutoComplete
            onSearch={this.searchOptions}
            onSelect={this.handleSelect}
            options={options}
            placeholder={formatMessage({ id: 'input.placeholder' })}
            style={{
              display: 'block'
            }}
          ></AutoComplete>
        </div>
        

      </div>
    );
  }
}

export default Page;


// 动态数据
function asycnFetchOptions (keywords: string) {
  return new Promise<[LabeledValue?]>((resolve) => {
    const res:[LabeledValue?] = []

    for (let i = 0; i < 5; i++) {
      res.push({
        value: keywords.repeat(i+1),
        label: <p>{keywords.repeat(i+1)}</p>,
        id: i
      })
    }

    setTimeout(() => {
      if (keywords) {
        resolve(res) 
      } else {
        resolve([])
      }
    }, 500)
  })
}