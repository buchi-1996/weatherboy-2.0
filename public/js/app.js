
class Weather{
    constructor(city){
        this.city = city;
        this.apiKey = 'aaf6e61337fd5555767d7bd243858055';
        this.loader = document.querySelector('#img__loader');
    }

    async getWeather(){
        const response =  await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${this.city}&appid=${this.apiKey}&units=metric`)
        const resData = await response.json();
        this.loader.style.display = 'none';
        return resData;
    }

    changeCity(city){
        this.city = city;
    }
}


class App{
    constructor(){
        this.list = document.querySelectorAll('.cities');
        this.loader = document.querySelector('#img__loader');
    }

    getCurrentWeather(){
        this.loader.style.display = 'block';
        myWeather.getWeather()
        .then(data => {
            const ui = new Ui();
            const myStore = new Storage();
            if(data.message){
                myStore.setData('new york');
                ui.showAlert('.wrong__city', data.message);
            }else{
                ui.updateWeather(data);
            }
        })
        .catch(err => console.log(err));
    }

    getCityText(item){
        const myStore = new Storage();
        myStore.setData(item);
        myWeather.changeCity(item);
        this.getCurrentWeather();
    }

    
}


class Ui{
    constructor(){
        this.cities = document.querySelector('.cities');
        this.image = document.querySelector('.image');
        this.input = document.querySelector('#search');
        this.cityName = document.querySelector('.city__name');
        this.date = document.querySelector('.date');
        this.weatherResult = document.querySelector('.city__temp');
        this.weatherIcon = document.querySelector('.weather__img img');
        this.weatherNow = document.querySelector('.weather__desc');
        this.eventWillHold = document.querySelector('.hold__event h2');
        this.wind = document.querySelector('.wind__range');
        this.feelsLike = document.querySelector('.feel__range');
        this.humidity = document.querySelector('.humidity__range');
        this.alert = document.querySelector('.my__alert');
        
    }

    showDate(){
        const date = new DateApp();
        console.log(date.getFullDate());
        this.date.textContent = date.getFullDate();
    }

    updateWeather(data){
        console.log(data);
        this.cityName.textContent = `${data.name}, ${data.sys.country}`;
        this.weatherResult.textContent = `${Math.trunc(data.main.temp)}\xB0c`;
        this.weatherIcon.setAttribute('src', `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`);
        this.weatherNow.textContent = data.weather[0].description;
        this.wind.textContent = `${data.wind.speed}`;
        this.feelsLike.textContent = `${Math.trunc(data.main.feels_like)}\xB0c`;
        this.humidity.textContent = `${Math.trunc(data.main.humidity)}`;
        this.image.setAttribute('src', `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`);
        this.eventWillHold.textContent = this.validateEvent(data);
    }

    validateEvent(item){
        let textInfo;
        if(item.weather[0].description === 'clear sky' || item.weather[0].description === 'few clouds'){
            textInfo = `Event is possible as weather report says ${item.weather[0].description}`;
           
        }else{
            textInfo = `Event not possible as weather report says ${item.weather[0].description}`;
        }
        return textInfo;
    }

    showAlert(alertName, errMessage){
        document.querySelector(alertName).classList.add('slideIn');
        document.querySelector(alertName).textContent = errMessage;

        setTimeout(() => {
            document.querySelector(alertName).classList.remove('slideIn');
        }, 3000)
    }

    populateTable(){
        const myCity = new Cities();
         myCity.getCities()
         .then(data => {
            const list = data.map(x => `<p class="list__item"><img src=${x.flag} alt="flag" class="flag__img">${x.city}</p>`).join('');
            this.cities.innerHTML = list;
         });
    }

}



class Cities {
    constructor() {
        this.api = 'https://restcountries.eu/rest/v2/all'
    }

    async getCities() {
        const response = await fetch(this.api);
        const resData = await response.json();
        const data = resData.map(x => {
            return {
                city: x.capital,
                flag: x.flag
            }
        })
        console.log(data);
        return data;
    }

    
}

class DateApp{
    constructor(){
        this.date = new Date();
    }

    getFullDate(){
        const options = {weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
        let fullDate = this.date.toLocaleDateString('en-US', options);
        return fullDate;
    }
}

class Storage{
    constructor(){
        this.city;
        this.defaultCity = 'new york';
    }

    getData(){
        if(localStorage.getItem('city') === null){
            this.city = this.defaultCity;
        }else{
            this.city = localStorage.getItem('city');
        }

        return {
            city: this.city
        }
    }

    setData(city){
        localStorage.setItem('city', city)
    }
}


const myStore = new Storage();
const getCity = myStore.getData();
const myWeather = new Weather(getCity.city);




// =============================================================
            // EVENT LISTENERS
//============================================================
document.addEventListener('DOMContentLoaded', e => {
    const ui = new Ui();
    const app = new App();
    ui.showDate();
    ui.populateTable();
    app.getCurrentWeather();
});

document.querySelector('.app__left').addEventListener('submit', (e) => {
    e.preventDefault();
    const app = new App();
    const ui = new Ui();
    const myStore = new Storage();
    let myCity = document.querySelector('#search').value;
    if(myCity !== ''){
        myWeather.changeCity(myCity);
        myStore.setData(myCity);
        app.getCurrentWeather();
        document.querySelector('#search').value = '';
    }else{
        ui.showAlert('.empty__field', 'insert city name before hitting enter');
    }
});

document.querySelector('.cities').addEventListener('click', (e)=>{
    const app = new App();
    app.getCityText(e.target.textContent);
})
