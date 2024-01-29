import CommonVar from "./commonVar.js"

class EventHandle extends CommonVar {
    constructor(option) {
        super()
        this.onChange = option && option.onChange;
        this.prevCustom = undefined
        this.eventHandle()
    }

    eventHandle() {
        document.addEventListener('mouseover', this.hoverOnList.bind(this))
        document.addEventListener('mousemove', this.removePointerEvent.bind(this))
        document.addEventListener('click', this.selectOptionWithEvent.bind(this))
        document.addEventListener('click', this.dropDown.bind(this),true)
        document.addEventListener('keydown', this.keyPress.bind(this))
    }

    hoverOnList(e) {
        if (e.target.closest(`.${this.optionClass}`)) {
            let li = e.target.closest(`.${this.optionClass}`)
            let listUl = li.closest(`.${this.dropDownDivClass}`)
            let list = listUl.closest(`.${this.dropDownDivClass}`).querySelectorAll(`.${this.optionClass}`)
            let activeLis = listUl?.querySelector('.active')
            if (li && !listUl.classList.contains('key-active')) {
                activeLis?.classList.remove('active')
                li.classList.add('active')
            }
        }
    }

    removePointerEvent(e) {
        if (e.target.closest(`.${this.optionClass}`)) {
            let li = e.target.closest(`.${this.optionClass}`)
            let listUl = li.closest(`.${this.dropDownDivClass}`)
            listUl.classList.remove('key-active')
        }
    }

    selectOptionWithEvent(e) {
        if (e.target.closest(`.${this.optionClass}`)) {

            let li = e.target.closest(`.${this.optionClass}`)
            let select = li.closest(`.${this.wrapperClass}`)?.querySelector('select')

            if (li && select) {
                if (select.multiple == true) {
                    let index = li.dataset['index']
                    let listUl = this.prevCustom.querySelector(`.${this.dropDownDivClass}`)
                    
                    e.preventDefault()

                    this.selectMultiple({ index, listUl, select })
                    
                } else {
                    this.prevCustom?.classList.remove('searching')
                    this.selectOption(li)
                    this.prevCustom = undefined;
                }

                let wrapperDiv = li.closest(`.${this.wrapperClass}`)
                this.handleListPost(wrapperDiv)
            }
        }
    }

    dropDown(e) {

        if(e.target.closest(`.${this.multiSelectResetIconClass}`) &&
         e.target.closest(`.${this.multiSelectResetIconClass}`).closest(`.${this.wrapperClass}`) == this.prevCustom
         ) return

        if (e.target.closest(`.${this.selectClass}`) && !e.target.closest(`.${this.multiSelectResetIconClass}`)) {
            let currentList = e.target.closest(`.${this.wrapperClass}`)
            if (this.prevCustom) {
                let prevCustomSelectItem = this.prevCustom.querySelector(`.${this.dropDownDivWrapperClass}`)
                prevCustomSelectItem?.classList.add('hidden')
            }

            if (currentList && currentList.querySelector('select') && !currentList.querySelector('select').disabled && this.prevCustom != currentList) {
                let currentListItem = currentList.querySelector(`.${this.dropDownDivWrapperClass}`)
                currentListItem?.classList.remove('hidden')

                this.handleListPost(currentList)

                this.prevCustom = currentList

                let select = currentList.querySelector('select')
                if (select && select.children.length > 0) {

                    let activeList = currentList.querySelector(`.${this.dropDownDivWrapperClass}`)?.querySelectorAll(`.active`)
                    let list = currentList.querySelector(`.${this.dropDownDivWrapperClass}`)?.querySelectorAll(`.${this.optionClass}`)

                    if (list) {

                        this.deselectAllOptions(activeList)
                        this.deActiveAllOptions(activeList)

                        if( select.selectedIndex > 0){

                            for (let i = 0; i < select.selectedOptions.length; i++) {
                                let filterList = currentList.querySelector(`.${this.dropDownDivWrapperClass}`)?.querySelector(`.${this.optionClass}[data-index='${select.selectedOptions[i].index}']`)
                                if(filterList){
                                    filterList.classList.add('selected')
                                    filterList.scrollIntoView({ block: 'center' })
                                }
                            }

                        }else{
                            if(list[1]){
                                list[1].scrollIntoView({ block: 'start' })
                            }
                        }
                    }
                }
            } else {
                this.prevCustom?.classList.remove('searching')
                this.prevCustom = undefined
            }
        } else {
            if ((this.prevCustom &&
                e.target.closest(`.${this.optionClass}`) &&
                !e.target.closest(`.${this.wrapperClass}`)?.querySelector('select')?.multiple
                ) ||
                e.target.closest(`.${this.wrapperClass}`) != this.prevCustom
                ) {
                let prevCustomSelectItem = this.prevCustom?.querySelector(`.${this.dropDownDivWrapperClass}`)
                prevCustomSelectItem?.classList.add('hidden')
                this.prevCustom?.classList.remove('searching')
                this.prevCustom = undefined
            }
        }
    }

    keyPress(e) {
        if (this.prevCustom) {
            let crrLi = this.prevCustom.querySelector(`.${this.dropDownDivClass} .active`) ? this.prevCustom.querySelector(`.${this.dropDownDivClass} .active`) : this.prevCustom.querySelector(`.${this.dropDownDivClass} .selected`)
            let listUl = this.prevCustom.querySelector(`.${this.dropDownDivClass}`)
            
            this.listSelectByKeyPress({ crrLi, listUl, e })
        }
    }

    listSelectByKeyPress(obj) {

        let { crrLi, listUl, e } = obj

        if(listUl && e){

            let mySel = listUl.closest(`.${this.wrapperClass}`)
            let reset = mySel?.querySelector('.reset-btn') ? true : false
            let search = mySel?.querySelector('.search-input') ? true : false

            if (e.key == 'ArrowDown') {

                listUl.classList.add('key-active')
    
                let firstLi = listUl.children[0]
                let nextSibl;
    
                if (crrLi && crrLi.nextElementSibling) {
                    nextSibl = crrLi.nextElementSibling
                } else {
                    if (reset || search) {
                        if (firstLi.nextElementSibling) {
                            nextSibl = firstLi.nextElementSibling
                        }
                    } else {
                        nextSibl = firstLi
                    }
                }
    
                crrLi?.classList.remove('active')
                nextSibl?.classList.add('active')

                if(nextSibl){
                    nextSibl.scrollIntoView({ behavior: 'smooth',block: 'center' })
                }
            }
            if (e.key == 'ArrowUp') {
                listUl.classList.add('key-active')
    
                let prevSibl;
                let lastLi = listUl?.children[listUl?.children.length - 1]
    
                if (crrLi && crrLi.previousElementSibling) {
                    if ((reset || search) && [...listUl?.children]?.indexOf(crrLi.previousElementSibling) == 0) {
                        prevSibl = lastLi
                    } else {
                        prevSibl = crrLi.previousElementSibling
                    }
                } else {
                    prevSibl = lastLi
                }
    
                crrLi?.classList.remove('active')
                prevSibl?.classList.add('active')

                if(prevSibl){
                    prevSibl.scrollIntoView({ behavior: 'smooth', block: 'center' })
                }
            }
    
            if (e.key == 'Enter') {
                this.prevCustom?.classList.remove('searching')
                if(this.prevCustom?.querySelector('select') && this.prevCustom?.querySelector('select').multiple){
    
                    let index = crrLi.dataset['index']
                    let select = listUl.closest(`.${this.wrapperClass}`)?.querySelector('select')

                    this.selectMultiple({index,listUl,select})
    
                }else{
                    this.selectOption(crrLi)
                    this.prevCustom = undefined;
                }

                this.handleListPost(this.prevCustom)
            }
        }

    }
}

export default EventHandle;
