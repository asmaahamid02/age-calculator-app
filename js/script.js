const form = document.querySelector('#dob-form')
const inputGroups = document.querySelectorAll('.input-group')
const errorPlaceholders = document.querySelectorAll('.error-text')
const numbersPlaceholders = document.querySelectorAll('.number')
const interval = 500

const handleSubmit = (e) => {
  e.preventDefault()

  const { day, month, year } = e.target.elements

  const dayValue = parseInt(day.value)
  const monthValue = parseInt(month.value)
  const yearValue = parseInt(year.value)

  //check empty
  let isError = checkInputs(dayValue, monthValue, yearValue)

  //check validity of day respect to month
  if (!isError) {
    //get days in the month
    const daysInMonth = new Date(yearValue, monthValue, 0).getDate()

    //check if day is valid
    if (dayValue > daysInMonth) {
      addWholeError('Must be a valid date')

      isError = true
    }
  }

  //check if date in future
  if (!isError) {
    if (new Date() <= new Date(yearValue, monthValue, dayValue)) {
      addWholeError('Date cannot be in future')

      isError = true
    }
  }

  if (isError) {
    clearNumbers()
    return
  }

  clearErrors()

  //calculate age
  const { years, months, days } = calculateAge(dayValue, monthValue, yearValue)

  //add the values to the DOM
  updateDOM(years, months, days)
}

const checkInputs = (dayValue, monthValue, yearValue) => {
  let isError = false

  isError = checkInput(0, dayValue, 'Day') || isError
  isError = checkInput(1, monthValue, 'Month') || isError
  isError = checkInput(2, yearValue, 'Year') || isError

  return isError
}

const checkInput = (index, value, label) => {
  let isError = false
  const currentYear = new Date().getFullYear()

  if (isNaN(value) || value === 0) {
    addError(index, `${label} field is required`)

    isError = true
  }

  if (index === 2) {
    if (value < 1900 || value > currentYear) {
      addError(index, `Must be a valid ${label.toLowerCase()}`)

      isError = true
    }
  } else if (index === 1) {
    if (value > 12) {
      addError(index, `Must be a valid ${label.toLowerCase()}`)

      isError = true
    }
  } else if (index === 0) {
    if (value > 31) {
      addError(index, `Must be a valid ${label.toLowerCase()}`)

      isError = true
    }
  }

  if (!isError) {
    removeError(index)
  }

  return isError
}

const addError = (index, message = null) => {
  inputGroups[index].classList.add('error')

  if (message) {
    errorPlaceholders[index].innerText = message
    errorPlaceholders[index].classList.remove('hidden')
  }
}

const removeError = (index) => {
  inputGroups[index].classList.remove('error')
  errorPlaceholders[index].innerText = ''
  errorPlaceholders[index].classList.add('hidden')
}

const addWholeError = (message) => {
  inputGroups.forEach((inputGroup) => inputGroup.classList.add('error'))
  errorPlaceholders[0].innerText = message
  errorPlaceholders[0].classList.remove('hidden')
}

const clearErrors = () => {
  inputGroups.forEach((inputGroup) => inputGroup.classList.remove('error'))
  errorPlaceholders.forEach((errorPlaceholder) => {
    errorPlaceholder.innerText = ''
    errorPlaceholder.classList.add('hidden')
  })
}

const clearNumbers = () => {
  numbersPlaceholders.forEach(
    (numberPlaceholder) => (numberPlaceholder.innerText = '- -')
  )
}

const calculateAge = (day, month, year) => {
  //get current date
  const currentDate = new Date()

  //find the difference between current date and birth date in days, years, months
  let years = currentDate.getFullYear() - year,
    months = currentDate.getMonth() - month,
    days = currentDate.getDate() - day

  //if days value is negative, add the days of the previous month to it
  if (days < 0) {
    const lastMonthDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      0
    ).getDate()

    days += lastMonthDay
  }

  //if months value is negative, subtract one year from years and add 12 months to the months
  if (months < 0) {
    years--
    months += 12
  }

  return { years, months, days }
}

const updateDOM = (years, months, days) => {
  console.log(years, months, days)
  animateNumber(0, years)
  animateNumber(1, months)
  animateNumber(2, days)
}

const animateNumber = (index, value) => {
  let startValue = 0
  const duration = Math.floor(interval / value)

  const counter = setInterval(() => {
    numbersPlaceholders[index].innerText = pad(startValue)
    if (startValue === value) clearInterval(counter)
    startValue += 1
  }, duration)
}

const pad = (number) => (number < 10 ? `0${number}` : number)

form.addEventListener('submit', handleSubmit)
