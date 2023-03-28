
const form = document.querySelector('#registrationForm')
const formValidation = () => {

    form.setAttribute('novalidate', '')
    form.addEventListener('submit', (e) => {
        e.preventDefault()
        // console.log('active')

       const formValid =  validateFormDetails(form)

       if(formValid) {
        fetch(form.action, {
            method : 'POST',
            body: new FormData(form)
        })
        .then((response) => response.json())
        .then(() => {
            const successMss = document.querySelector('.successMss');
            successMss.style.color = 'green';
            successMss.textContent = 'You have Registered successfully'

            setTimeout(() => {
                successMss.textContent = ''
            }, 5000)
            form.reset()
        })
        .then(() => {
            open('success.html', '_blank')
        })

        
       }
    })
    const formElToBlur = Array.from(form)

    formElToBlur.forEach((formEl) => {
        formEl.addEventListener('blur', (event) => {
            validateSingleDetails(event.srcElement.parentElement.parentElement.parentElement)
        })
    })


}


formValidation()

const validateFormDetails = (formToValidate) => {
    const formDetailsEl = Array.from(formToValidate.querySelectorAll('.formDetails'))
    // console.log(formDetailsEl)

    return formDetailsEl.every((formDetail) => validateSingleDetails(formDetail))
}


const validateOptions = [
    {
        attribute: 'minlength',
        isValid: input => input.value && input.value.length >= input.minLength,
        errorMessage: (input, label) => `${label.textContent} should be at least 2 characters`
    },
    {
        attribute: 'custommaxlength',
        isValid: input => input.value && input.value.length <= input.getAttribute('custommaxlength'),
        errorMessage: (input, label) => `${label.textContent} needs to be ${input.getAttribute('custommaxlength')} or less than ${input.getAttribute('custommaxlength')} characters`
    },
    {
        attribute: 'pattern',
        isValid: input => {
            const regex = new RegExp(input.pattern)
            return regex.test(input.value)
            // console.log(regex)
        },
        errorMessage: (input, label) => `${input.value} is not a valid id`
    },
    {
        attribute: 'match',
        isValid: input => {
            const selectorEl = input.getAttribute('match');
            const elToMatch = form.querySelector(`#${selectorEl}`)
            return elToMatch && elToMatch.value.trim() === input.value.trim()
        },
        errorMessage: (input, label) => {
            const selectorEl = input.getAttribute('match')
            const elToMatch = form.querySelector(`#${selectorEl}`)
            const elToMatchLabel = elToMatch.parentElement.parentElement.querySelector('label');

            return `${label.textContent} must match ${elToMatchLabel.textContent}`
        }
    },
    {
        attribute: 'required',
        isValid: input => input.value.trim() !== '',
        errorMessage: (input, label) => `${label.textContent} is required, kindly fill the field`
    }

    
]

const validateSingleDetails = (formDetail) => {
    const label = formDetail.querySelector('label');
    const input = formDetail.querySelector('input');
    const successIcon = formDetail.querySelector('.successCheck');
    const errorIcon = formDetail.querySelector('.errorCheck');
    const errorMsg = formDetail.querySelector('.errorMessage');

    let errorDetail = false

    for(const options of validateOptions) {
        if(input.hasAttribute(options.attribute) && !options.isValid(input)) {
            errorMsg.textContent = options.errorMessage(input, label)
            errorIcon.style.display = 'inline'
            successIcon.style.display = 'none'
            input.classList.add('redBorder')
            errorDetail = true
        }
        else if(!errorDetail){
            errorMsg.textContent = ' '
            successIcon.style.display = 'inline'
            errorIcon.style.display = 'none'
            input.classList.remove('redBorder')
            input.classList.add('greenBorder')
        }
    }
    return !errorDetail
}


