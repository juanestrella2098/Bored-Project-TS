import { BoredResponse } from './boredResponse';
import { Hit, ImageAPIResponse } from './imageResponse';
import './style.css'
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'



let type = document.getElementById("type") as HTMLInputElement;
let participants = document.getElementById("participants") as HTMLInputElement;
let text = document.getElementById("texto") as HTMLDivElement;
let price = document.getElementById("precData") as HTMLDivElement;
let acces = document.getElementById("accsData") as HTMLDivElement;
let nParti = document.getElementById("nPartData") as HTMLDivElement;
let button = document.getElementById("button") as HTMLInputElement;
let foto = document.getElementById("foto") as HTMLImageElement;

button.addEventListener('click', async () => {

    let url: string = '';

    if (type.value == '' && participants.value == '') {
        url = 'http://bored.api.lewagon.com/api/activity/';
    }
    else if (type.value != "" && participants.value == '') {
        url = `http://bored.api.lewagon.com/api/activity?type=${type.value}`;
    } else if (type.value == '' && participants.value != '') {
        url = `http://bored.api.lewagon.com/api/activity?participants=${participants.value}`;
    } else {
        url = `http://bored.api.lewagon.com/api/activity?type=${type.value}&participants=${participants.value}`;
    }

    await fetch(url)
        .then(async (response) => {
            {
                const data: BoredResponse = await response.json();

                if (type.value == '') {
                    if (data.type == 'busywork') {
                        type.value = 'busy';
                    }
                    type.value = data.type;
                }

                let urlImage = 'https://pixabay.com/api/?key=30026207-4b73debf46e6f4edbc0cf0cdf&q=' + type.value + '&image_type=photo';

                await fetch(urlImage)
                    .then(async (responseImage) => {

                        const dataImages: ImageAPIResponse = await responseImage.json();
                        const random = Math.random() * 5;
                        const roundedRandom = random.toFixed(2);
                        const image = dataImages.hits[parseInt(roundedRandom)].largeImageURL;

                        foto.src = image;
                        foto.alt = 'Una imagen con el tipo ' + data.type;
                        text.innerHTML = data.activity;
                        price.innerHTML = (data.price == 0) ? "Gratis" : "Hay que pagar";
                        acces.innerHTML = "Accesibilidad: " + data.accessibility;
                        nParti.innerHTML = "Nº de participantes: " + data.participants.toString();

                    })


            }
        })
        .catch((error: Error) => {
            foto.src = ''
            foto.alt = 'No se pudo obtener la imagen';
            text.innerHTML = 'No se ha encontrado ninguna actividad asociada.'
            price.innerHTML = 'No se obtuvo el precio';
            acces.innerHTML = 'No se obtuvo la accesibilidad';
            nParti.innerHTML = 'No se obtuvo los participantes';
        })

})

