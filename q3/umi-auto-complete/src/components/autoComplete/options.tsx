import React, { useCallback } from 'react'
import ReactDOM from 'react-dom'
import style from './index.less'

const bodyDom = document.getElementsByTagName("body")[0]

// 下拉列表选项
export interface LabeledValue {
    value: string;
    label: React.ReactNode | string;
    [proppName:string]:any;
}

// props
export interface OptionsProps {
    visible: boolean
    optionsSetting: {},
    options: [LabeledValue?],
    onSelect: (value: string, option: LabeledValue) => void
}

const Options = React.memo(({ visible, optionsSetting, options, onSelect }: OptionsProps) => {

    // 选项选中
    const handleSelect = useCallback((value: string, option: LabeledValue) => {
        onSelect(value, option)
    }, [])

    // 阻止 input blur 事件
    const preventDefault = useCallback((e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        if (e && e.preventDefault) {
            e.preventDefault();
        } else {
            window.event!.returnValue = false;
        }
        return false;
    }, [])

    return ReactDOM.createPortal(
        <div className={style.dropdown}>
            <div
                className={`${style['dropdown-list']} ${visible ? style['dropdown-show'] : style['dropdown-hide']}`}
                style={{
                    ...optionsSetting
                }
                }>
                {
                    options.map(item => {
                        return (
                            <div
                                className={style['options-item']}
                                key={item!.value}
                                onClick={() => handleSelect(item!.value, item!)}
                                onMouseDown={(e) => preventDefault(e)}
                            >
                                {item!.label}
                            </div>
                        )
                    })
                }
            </div>
        </div>,
        bodyDom
    )
})

export default Options