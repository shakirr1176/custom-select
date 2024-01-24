class CommonVar{
    constructor(){
        this.searchInputClass = 'search-input'
        this.wrapperClass = 'my-select-js'
        this.selectClass = 'selected-div',
        this.dropDownDivWrapperClass = 'list-wrapper'
        this.dropDownDivClass = 'list-ul',
        this.optionClass = 'custom-list'
    }

    selectOption(li) {
        let customSelect = li.closest(`.${this.wrapperClass}`);
        if (customSelect) {
            let listWrapper = li.closest(`.${this.dropDownDivWrapperClass}`)
            let listUl = li.closest(`.${this.dropDownDivClass}`);
            let list = listUl.closest(`.${this.dropDownDivClass}`).querySelectorAll(`.${this.optionClass}`);
            let opts = customSelect.querySelector('select')?.querySelectorAll('option');
            let resetBtn = customSelect.querySelector('.reset-btn');

            this.deselectAllOptions(list);

            let indexOfli = [...list].indexOf(li);

            opts[indexOfli].selected = true;
            li?.classList.add('selected');
            resetBtn?.classList.remove('hidden');

            if (indexOfli == 0 && (opts[0] && (opts[0].getAttribute('value') == null || opts[0].getAttribute('value') == ''))) {
                li?.classList.remove('selected');
                resetBtn?.classList.add('hidden');
                let select = customSelect.querySelector('select');

                if (select) {
                    select.value = '';
                }
            }

            if (this.reset || this.search) {
                listUl.children[0].classList.add('hidden')
            }

            let selectedDiv = customSelect.querySelector(`.${this.selectClass}`);

            selectedDiv.innerHTML = li.innerHTML;

            let select = customSelect.querySelector('select');

            select.dataset['oldvalue'] = select.value

            if (!customSelect.classList.contains('searching')) {
                listWrapper.classList.add('hidden');
            }
            
            if (typeof this.onChange === 'function') {
                this.onChange(select);
            }
        }
    }

    deselectAllOptions(list) {
        list?.forEach(opt => opt.classList.remove('selected'));
    }

    handleListPost(wrapperDiv){

        if (!wrapperDiv) return

        let dropdown = wrapperDiv.querySelector(`.${this.dropDownDivWrapperClass}`);

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
}

export default CommonVar