import React, { useState, useEffect, useRef, useCallback, useLayoutEffect } from 'react'
import styles from './index.less'

import Options from './options'

// 下拉列表选项
export interface LabeledValue {
    value: string;
    label: React.ReactNode | string;
    [proppName:string]:any;
}

// props
export interface InputProps {
    placeholder?: string;
    options: [LabeledValue?];
    onChange?: (value: string) => void;
    onSearch?: (value: string) => void;
    onSelect?: (value: string, option: LabeledValue) => void;
    style?: React.CSSProperties;
}

// 下拉列表位置
export interface optionsSetting {
    left: string | number,
    top: string | number,
    width: string | number,
}

// 防抖 ref
export interface debounceRef {
    fn: () => void,
    timer: any,
}

// 防抖
function useDebounce(fn: () => void, delay: number, dep = []) {
    const { current } = useRef<debounceRef>({ fn, timer: undefined });
    useEffect(function () {
        current.fn = fn;
    }, [current.fn, fn]);

    return useCallback(function f(...args) {
        if (current.timer) {
            clearTimeout(current.timer);
        }
        current.timer = setTimeout(current.fn, delay);
    }, [current.fn, current.timer, delay])
}


const AutoComplete = React.memo(({ placeholder, options, onChange, onSearch, onSelect, style }: InputProps) => {
    // input 值
    const [value, setValue] = useState('') 
    // 是否显示下拉选项
    const [visible, setVisible] = useState(false) 
    // 下拉列表位置
    const [optionsSetting, setOptionsSetting] = useState<optionsSetting>({
        left: 'initial',
        top: 'initial',
        width: 'initial'
    }) 
    // autocomplete ref
    const curRef = useRef<HTMLDivElement>(null); 

    // 获取 autocomplete 位置 更新 optionsSetting
    useLayoutEffect(() => {
        const rect = curRef.current!.getBoundingClientRect()
        optionsSetting.left = rect.left
        optionsSetting.top = rect.top + rect.height
        optionsSetting.width = rect.width
        setOptionsSetting(optionsSetting)
    }, [optionsSetting])

    // input change
    const handleChange = useCallback((e: any) => {
        setValue(e.target.value)

        if (onChange) {
            onChange(e.target.value)
        }
    }, [onChange])

    // 搜索
    const handleSearch = useDebounce(() => {
        if (onSearch) {
            onSearch(value)
        }
    }, 500)

    // value变更执行搜索
    useEffect(() => {
        handleSearch()
    }, [handleSearch, value]);
    
    // 失去焦点
    const handleBlur = useCallback(() => {
        setVisible(false)
    }, [])

    // 获取的焦点
    const handleFocus = useCallback(() => {
        setVisible(true)
    }, [])

    // 选择 option
    const handleSelect = useCallback((value: string, option: LabeledValue) => {
        setValue(option.value)
        setVisible(false)
        curRef.current!.children[0].blur()

        if (onSelect) {
            onSelect(value, option)
        }
    }, [onSelect])

    return (
        <React.Fragment>
            <div
                ref={curRef}
                className={`${styles['auto-complete']} ${visible ? styles['auto-complete-select'] : ''}`}
                style={{...style}}
            >
                <input
                    value={value}
                    placeholder={placeholder}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onFocus={handleFocus}
                />
            </div>
            <Options
                visible={visible && options.length > 0}
                optionsSetting={optionsSetting}
                options={options}
                onSelect={handleSelect}
            ></Options>
        </React.Fragment>
    )
})

export default AutoComplete