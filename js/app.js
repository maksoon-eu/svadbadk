document.addEventListener('DOMContentLoaded', function () {
    const radios = document.querySelectorAll('.form__inner-radio');
    const checkboxes = document.querySelectorAll('.form__inner-checkbox');

    const errorMsg = document.querySelector('.form__inner-log');

    let attendanceInput;
    let drinksInput = [];

    radios.forEach((radio) => {
        radio.addEventListener('click', function () {
            radios.forEach((item) => item.classList.remove('selected'));
            this.classList.add('selected');

            errorMsg.style.opacity = '0';

            attendanceInput = Array.from(radios)
                .filter((item) => item.classList.contains('selected'))[0]
                .getAttribute('data-value');
        });
    });

    checkboxes.forEach((checkbox) => {
        checkbox.addEventListener('click', function () {
            this.classList.toggle('selected');

            errorMsg.style.opacity = '0';

            if (this.classList.contains('selected')) {
                drinksInput.push(this.getAttribute('data-value'));
            } else {
                drinksInput = drinksInput.filter(
                    (item) => item !== this.getAttribute('data-value')
                );
            }
        });
    });

    const address = document.querySelector('.address');
    const addressText = document.querySelector('.addressText');
    const copyImg = document.querySelector('.copyImg');
    const doneImg = document.querySelector('.doneImg');
    const rejectImg = document.querySelector('.rejectImg');

    address.addEventListener('click', function () {
        const addressTextCopy = addressText.textContent;
        navigator.clipboard
            .writeText(addressTextCopy)
            .then(() => {
                copyImg.style.opacity = 0;
                doneImg.style.opacity = 1;
                setTimeout(() => {
                    copyImg.style.opacity = 1;
                    doneImg.style.opacity = 0;
                }, 2000);
            })
            .catch(() => {
                copyImg.style.opacity = 0;
                rejectImg.style.opacity = 1;
                setTimeout(() => {
                    copyImg.style.opacity = 1;
                    rejectImg.style.opacity = 0;
                }, 2000);
            });
    });

    const btn = document.querySelector('.form__inner-btn');

    btn.addEventListener('click', function (e) {
        e.preventDefault();

        const name = document.getElementById('name').value;

        if (!name || !attendanceInput || (attendanceInput === 'Приду' && drinksInput.length < 1)) {
            errorMsg.textContent = 'Заполните все поля';
            errorMsg.classList.add('error');
            errorMsg.style.opacity = '1';
        } else {
            if (attendanceInput === 'Не приду') {
                drinksInput = [];
            }

            const loader = document.querySelector('.form__btn-loader');
            const text = document.querySelector('.form__btn-text');

            let data = new FormData();
            data.append('name', name);
            data.append('attendance', attendanceInput);
            data.append('drinks', drinksInput.join(', '));

            const scriptId =
                'AKfycbx8iBEHVnNfNYzcmckPHGRxhT_6erOOPj4fnMWVxX9lvKmEcO9hw0RtXg_KboKZqEZw';
            const url = `https://script.google.com/macros/s/${scriptId}/exec`;

            loader.style.opacity = '1';
            text.style.opacity = '0';

            fetch(`${url}`, {
                method: 'POST',
                mode: 'no-cors',
                body: data,
            })
                .then((data) => {
                    console.log('Success:', data);
                    loader.style.opacity = '0';
                    text.style.opacity = '1';
                })
                .catch((error) => {
                    console.error('Error:', error);
                    loader.style.opacity = '0';
                    text.style.opacity = '1';
                });
        }
    });
});
