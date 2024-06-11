document.addEventListener('DOMContentLoaded', function () {
    const radios = document.querySelectorAll('.form__inner-radio');
    const checkboxes = document.querySelectorAll('.form__inner-checkbox');

    const errorMsg = document.querySelector('.form__inner-log');

    let attendanceInput;
    let drinksInput = [];

    radios.forEach(radio => {
        radio.addEventListener('click', function () {
            radios.forEach(item => item.classList.remove('selected'));
            this.classList.add('selected');

            errorMsg.style.opacity = '0';

            attendanceInput = Array.from(radios).filter(item => item.classList.contains('selected'))[0].getAttribute('data-value');
        });
    });

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('click', function () {
            this.classList.toggle('selected');

            errorMsg.style.opacity = '0';

            if (this.classList.contains('selected')) {
                drinksInput.push(this.getAttribute('data-value'));
            } else {
                drinksInput = drinksInput.filter(item => item !== this.getAttribute('data-value'));
            }
        });
    });

    const btn = document.querySelector('.form__inner-btn');

    btn.addEventListener('click', function (e) {
        e.preventDefault();

        const name = document.getElementById('name').value;
        
        if (!name || !attendanceInput || drinksInput.length < 1) {
            errorMsg.textContent = 'Заполните все поля';
            errorMsg.classList.add('error');
            errorMsg.style.opacity = '1';
        } else {
            const data = {
                name,
                attendance: attendanceInput,
                drinks: drinksInput
            };

            const url = 'https://script.google.com/macros/s/AKfycbxeT77AnQbYDg6rOv45QY2ytrlIm9qAZ6Cnq3POTuHN8J36MRyF_Pa4nme7UCu9OzvloA/exec'

            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then(response => response.json())
                .then(result => {
                    if (result.result === 'success') {
                        errorMsg.textContent = 'Данные успешно отправлены';
                        errorMsg.classList.add('good');
                        errorMsg.style.opacity = '1';
                    } else {
                        throw new Error('Ошибка при отправке данных');
                    }
                })
                .catch(error => {
                    errorMsg.textContent = error.message;
                    errorMsg.classList.add('error');
                    errorMsg.style.opacity = '1';
                });
        }
    });
});