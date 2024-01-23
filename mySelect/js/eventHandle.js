import CommonVar from "./commonVar.js"

 class EventHandle extends CommonVar{
    constructor(option) {
        super()
        this.onChange = option.onChange;
        this.prevCustom = undefined
        this.eventHandle()
    }

    eventHandle() {
        document.addEventListener('mouseover', this.hoverOnList.bind(this))
        document.addEventListener('mousemove', this.removePointerEvent.bind(this))
        window.addEventListener('click', this.selectOptionWithEvent.bind(this))
        window.addEventListener('click', this.dropDown.bind(this))
        document.addEventListener('keydown', this.keyPress.bind(this))
    }

    hoverOnList(e) {
        if (e.target.closest(`.${this.optionClass}`)) {
            let li = e.target.closest(`.${this.optionClass}`)
            let listUl = li.closest(`.${this.dropDownDivClass}`)
            let list = listUl.closest(`.${this.dropDownDivClass}`).querySelectorAll(`.${this.optionClass}`)
            if (li && !listUl.classList.contains('key-active')) {
                this.deselectAllOptions(list)
                li.classList.add('selected')
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
            if (li) {
                this.prevCustom?.classList.remove('searching')
                this.selectOption(li)
                this.prevCustom = undefined;
            }
        }
    }

    dropDown(e) {
        if (e.target.closest(`.${this.selectClass}`)) {
            let currentList = e.target.closest(`.${this.wrapperClass}`)
            if (this.prevCustom) {
                let prevCustomSelectItem = this.prevCustom.querySelector(`.${this.dropDownDivWrapperClass}`)
                prevCustomSelectItem?.classList.add('hidden')
            }

            if (currentList && currentList.querySelector('select') && !currentList.querySelector('select').disabled && this.prevCustom != currentList) {
                let currentListItem = currentList.querySelector(`.${this.dropDownDivWrapperClass}`)
                currentListItem?.classList.remove('hidden')
                this.prevCustom = currentList

                let select = currentList.querySelector('select')
                if (select && select.children.length > 0) {

                    let list = currentList.querySelector(`.${this.dropDownDivWrapperClass}`)?.querySelectorAll(`.${this.optionClass}`)

                    if (list && list[select.selectedIndex]) {
                        this.deselectAllOptions(list)
                        list[select.selectedIndex].classList.add('selected')
                        list[select.selectedIndex].scrollIntoView({ block: 'center' })
                    } else {
                        if (list.length) {
                            this.deselectAllOptions(list)
                            list[0].scrollIntoView({ block: 'center' })
                        }
                    }
                }
            } else {
                this.prevCustom?.classList.remove('searching')
                this.prevCustom = undefined

            }
        } else {
            if ((this.prevCustom && !e.target.closest(`.${this.dropDownDivWrapperClass}`)) || e.target.closest(`.${this.optionClass}`)) {
                let prevCustomSelectItem = this.prevCustom?.querySelector(`.${this.dropDownDivWrapperClass}`)
                prevCustomSelectItem?.classList.add('hidden')
                this.prevCustom?.classList.remove('searching')
                this.prevCustom = undefined
            }
        }
    }

    keyPress(e) {
        if (this.prevCustom) {
            let crrLi = this.prevCustom.querySelector(`.${this.dropDownDivClass} .selected`)
            let listUl = this.prevCustom.querySelector(`.${this.dropDownDivClass}`)
            this.listSelectByKeyPress({ crrLi, listUl, e })
        }
    }

    listSelectByKeyPress(obj) {

        let { crrLi, listUl, e } = obj

        let mySel = listUl.closest(`.${this.wrapperClass}`)
        let reset = mySel?.querySelector('.reset-btn') ? true : false
        let search = mySel?.querySelector('.search-input') ? true : false

        if (e.key == 'ArrowDown') {
            if (listUl) {
                listUl.classList.add('key-active')
            }

            let firstLi = listUl?.children[0]
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

            crrLi?.classList.remove('selected')
            nextSibl?.classList.add('selected')

            nextSibl.scrollIntoView({ behavior: 'smooth' })
        }
        if (e.key == 'ArrowUp') {

            if (listUl) {
                listUl.classList.add('key-active')
            }

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

            crrLi?.classList.remove('selected')
            prevSibl?.classList.add('selected')

            prevSibl.scrollIntoView({ behavior: 'smooth', block: 'end' })
        }

        if (e.key == 'Enter') {
            this.prevCustom?.classList.remove('searching')
            this.selectOption(crrLi)
            this.prevCustom = undefined;
        }
    }
}

export default EventHandle;
