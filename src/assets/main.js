// API
const API = 'https://ytstream-download-youtube-videos.p.rapidapi.com/dl?id=';
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '3084131eaamsh783118b0dbe9735p17f811jsnfc3aa2f0f060',
		'X-RapidAPI-Host': 'ytstream-download-youtube-videos.p.rapidapi.com'
	}
};

async function fetchData (url) {
    const response = await fetch(url, options);
    const result = await response.json();
    
    console.log(result);
    return result;
}

// DOM
const input = document.getElementById('search');
const btn = document.getElementById('submit');
const title = document.getElementById('video-title');
const image = document.getElementById('video-img');
const mp4 = document.querySelectorAll('.mp4-dwd');
const mp3 = document.querySelectorAll('.mp3-dwd');
const loading = document.querySelectorAll('.sk');
const formatTitle = document.querySelectorAll('p');

// Funcion Principal
async function getVideo(id) {
    try {
        const element = await fetchData(`${API}${id}`);

        console.log(element)
        if(!element.error) {

            loading.forEach(elem => elem.classList.remove('skeleton'));
            formatTitle[0].classList.add('active');
            formatTitle[0].innerText = "VIDEO";

            title.innerText = element.title;
            image.src = element.thumbnail[2].url;

            for (let i = 0; i < mp4.length; i++) {
                if (!element.formats[i]) break;
                if (!element.formats[i].mimeType.includes('video/mp4')) {
                    mp4[i].style.display = 'none';
                    continue;
                }
                mp4[i].innerText = element.formats[i].height + 'p';
                mp4[i].href = element.formats[i].url;
                mp4[i].classList.add('active');
            }

            const audioFormats = element.adaptiveFormats.filter(format => format.mimeType.includes('audio'));
            console.log(audioFormats)
            if (audioFormats) {
                formatTitle[1].innerText = "AUDIO";
                for (let i = 0; i < mp3.length; i++) {
		    if (!audioFormats[i]) break;
                    mp3[i].innerText = audioFormats[i].mimeType.substring(audioFormats[i].mimeType.indexOf('/') + 1, audioFormats[i].mimeType.indexOf(';'));
                    mp3[i].href = audioFormats[i].url;
                    mp3[i].classList.add('active');
                }
            }
        } else {
            alert('Ingresa una url válida');
            loading.forEach(elem => elem.classList.remove('skeleton'));
        }
    } catch {
        loading.forEach(elem => elem.classList.remove('skeleton'));
        throw new Error('Ingresa una url válida');
    }
}


// Event listener
btn.addEventListener('click', () => {
    let videoUrl = input.value;
    let videoId = videoUrl.substring(videoUrl.indexOf('=') + 1, videoUrl.length);

    if (title.textContent === "") loading.forEach(elem => elem.classList.add('skeleton'));
    getVideo(videoId);
})
