class CommonVar {
    constructor() {
        this.searchInputClass = 'search-input'
        this.wrapperClass = 'my-select-js'
        this.selectClass = 'selected-div',
        this.dropDownDivWrapperClass = 'list-wrapper'
        this.dropDownDivClass = 'list-ul',
        this.optionClass = 'custom-list'
        this.multiSelectResetIconClass = 'multi-select-reset-icon',
        this.multiCancelIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>`
    }

    selectOption(li) {

        let customSelect = li.closest(`.${this.wrapperClass}`);

        if (customSelect) {
            let listWrapper = li.closest(`.${this.dropDownDivWrapperClass}`)
            let listUl = li.closest(`.${this.dropDownDivClass}`);
            let opts = customSelect.querySelector('select')?.querySelectorAll('option');
            let resetBtn = customSelect.querySelector('.reset-btn');
            let activeLi = listUl.querySelector('.selected')

            activeLi?.classList.remove('selected')

            let indexOfli = li.dataset['index'];

            opts[indexOfli].selected = true;

            li?.classList.add('selected');

            resetBtn?.classList.remove('hidden');

            let selectedDiv = customSelect.querySelector(`.${this.selectClass}`);

            selectedDiv.innerHTML = li.innerHTML;

            let select = customSelect.querySelector('select');

            if (!customSelect.classList.contains('searching')) {
                listWrapper.classList.add('hidden');
            }

            if (typeof this.onChange === 'function') {
                this.onChange(select);
            }
        }
    }

    selectMultiple(opt) {
        let { index, listUl, select } = opt
        if (index && listUl && select) {

            let wrapper = select.closest(`.${this.wrapperClass}`)
            let options = select.querySelectorAll('option')

            let allLi = listUl.querySelector(`.${this.optionClass}[data-index='${index}']`)
            let resetBtn = wrapper.querySelector('.reset-btn');
            
            if (options[index]) {
                options[index].selected = !options[index].selected
            }

            allLi?.classList.toggle('selected')

            let selectedDiv = wrapper?.querySelector(`.${this.selectClass}`)
            let showOption = +selectedDiv.dataset['showOption']
            if(selectedDiv.innerHTML == ''){
                selectedDiv.innerHTML = wrapper.dataset['default_selected_text']
            }

            let oldSelected = selectedDiv.querySelector(`.multi-selected-option-${index}`)

            if (oldSelected) {
                oldSelected.remove()
            } else {
                if(selectedDiv.innerHTML == wrapper.dataset['default_selected_text']){
                    selectedDiv.innerHTML = ''
                }

                if(select.selectedOptions.length > showOption){
                    selectedDiv.innerHTML = `<div class="count-selected" style="text-align:center; width: 100%">Selected ${select.selectedOptions.length}</div>`
                }else{
                    selectedDiv.innerHTML = ''
                    for (let i = 0; i < select.selectedOptions.length; i++) {
                        this.appendOptionInSelectedDiv(select.selectedOptions[i].index,selectedDiv,options)
                    }
                }

                resetBtn?.classList.remove('hidden')
            }

            if(select.selectedOptions.length == 0){
                selectedDiv.innerHTML = wrapper.dataset['default_selected_text']
                resetBtn?.classList.add('hidden')
            }

            if (typeof this.onChange === 'function') {
                this.onChange(select);
            }
        }
    }

    appendOptionInSelectedDiv (index,selectedDiv,options){

        let span = document.createElement('span')

        span.className = `multi-selected-option multi-selected-option-${index}`

        let multiCancelIconDiv = document.createElement('span')

        multiCancelIconDiv.className = this.multiSelectResetIconClass
        multiCancelIconDiv.innerHTML = this.multiCancelIcon
        multiCancelIconDiv.onclick = ()=> this.removeMultiSelectedOption(span,index)
        multiCancelIconDiv.onmouseover = ()=> span.classList.add('active')
        multiCancelIconDiv.onmouseleave = ()=> span.classList.remove('active')
        span.appendChild(multiCancelIconDiv)

        let textSpan = document.createElement('span')

        let curSllLi = options[index]

        if(curSllLi){
            textSpan.innerHTML = curSllLi.innerHTML
        }

        span.appendChild(textSpan)

        selectedDiv.appendChild(span)
    }

    deselectAllOptions(list) {
        list?.forEach(opt => opt.classList.remove('selected'));
    }
    deActiveAllOptions(list) {
        list?.forEach(opt => opt.classList.remove('active'));
    }

    handleListPost(wrapperDiv) {
        if (!wrapperDiv) return

        let dropdown = wrapperDiv.querySelector(`.${this.dropDownDivWrapperClass}`);

        if(!dropdown) return

        let button = wrapperDiv.querySelector(`.${this.selectClass}`)

        if (!button) return

        let spaceBelow = window.innerHeight - button.getBoundingClientRect().bottom;
        let spaceAbove = button.getBoundingClientRect().top;
       
        if (spaceBelow < dropdown.clientHeight && spaceAbove > dropdown.clientHeight) {
            dropdown.style.top = (button.offsetTop - dropdown.clientHeight - 4) + 'px';
        } else {
            dropdown.style.top = (button.offsetTop + button.offsetHeight + 4) + 'px';
        }
    }

    removeMultiSelectedOption(div,index){

        let wrapper = div.closest(`.${this.wrapperClass}`)
        let resetBtn = wrapper.querySelector(`.reset-btn`)
        let select = wrapper?.querySelector('select')
        let listUl = wrapper?.querySelector(`.${this.dropDownDivClass}`)

        let options = select?.querySelectorAll('option')
        let allLi = listUl?.querySelector(`.${this.optionClass}[data-index='${index}']`)

        if(options[index]){
            options[index].selected = false
        }

        allLi?.classList.remove('selected')

        div.remove()

        let selectedDiv = wrapper.querySelector('.selected-div')
        if(selectedDiv.innerHTML == ''){
            selectedDiv.innerHTML = wrapper.dataset['default_selected_text']
        }

        if(select && select.selectedOptions.length == 0){
            resetBtn?.classList.add('hidden')
        }

        this.handleListPost(wrapper)
    }
}

export default CommonVar