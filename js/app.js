const container=document.querySelector('.container');
const resultado=document.querySelector('#resultado');
const formulario=document.querySelector('#formulario');

window.addEventListener('load', ()=>{
    //cuando tengamos un submit vamos a hacer la siguiente funcion
    formulario.addEventListener('submit', buscarClima);
});

function buscarClima(e){
    e.preventDefault();

    //validar 
    //seleccionamos cada input por su ID y para obtener lo que el usuario esta escribiendo ponemos .value
    const ciudad=document.querySelector('#ciudad').value;
    const pais=document.querySelector('#pais').value;

    //si ciudad es "" y pais es "" significa que el usuario no a seleccionado nada 
    if(ciudad === "" || pais === ""){
            //hubo un error
            mostrarError('Ambos campos son obligatorios');
            // y detenemos la ejecucion del codigo con un return
            return;
    }
    //consultamos en la API, donde mandamos a llamar a otra funcion
    consultarAPI(ciudad, pais);

}

function mostrarError(mensaje){
    const alerta= document.querySelector('.bg-red-100');

    //si no hay ninguna alerta 
    if (!alerta) {
        //crear una alerta
        const alerta=document.createElement('div');
        //le agregamos una clase al div
        alerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700','px-4', 'py-3', 'rounded', 'max-w-md','mx-auto', 'mt-6', 'text-center');
        //
        alerta.innerHTML=`
        <strong class="font-bold">Error!</strong>
        <span class="block sm:inline">${mensaje}</span>
    `;
    
        container.appendChild(alerta)

        //se elimine la alerta despues de 5 segundo

        setTimeout(() => {
            alerta.remove()
        }, 5000);
    }

}

function consultarAPI(ciudad, pais) {

    //colocamos el id de la API que vamos a consultar
    const appId= 'af3894744e3ea3c5cfea32e1b6ef2a5b';

    const url= `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appId}`;

    //esto nos va a traer una respuesta
    fetch(url)
        //entonces vamos a tener una respuesta 
        .then(respuesta=> respuesta.json())
        //entonces vamos a tener ya los datos y validamos que los datos que nos piden sean correctos
        .then(datos=>{

            limpiarHTML(); //limpiar el html previo

            if(datos.cod === "404"){
                mostrarError('ciudad no encontrada');
                return;
            }

            //imprime la respuesta en el HTML
            mostrarClima(datos);

        })
}

function mostrarClima(datos) {
        const {name, main:{temp, temp_max, temp_min}}=datos;

        const grados= KelvinACentigrados(temp);
        const max= KelvinACentigrados(temp);
        const min= KelvinACentigrados(temp);
        

        //creamos los parrafos

        const nombreCiudad=document.createElement('p');
        nombreCiudad.textContent=` Clima en ${name}`;
        nombreCiudad.classList.add('font-bold', 'text-2xl');


        const actual=document.createElement('p');
        actual.innerHTML=`${grados} &#8451;`; // este codigo final va a imprimir como si fueran grados centigrados
        actual.classList.add('font-bold', 'text-6xl');

        const temperaturaMax=document.createElement('p');
        temperaturaMax.innerHTML=`Max: ${max} &#8451;`;
        temperaturaMax.classList.add('text-xl');

        const temperaturaMin=document.createElement('p');
        temperaturaMin.innerHTML=`Min: ${min} &#8451;`;
        temperaturaMin.classList.add();

        //agregamos el parrafo en este div que vamos a crear
        const resultadoDiv=document.createElement('div');
        resultadoDiv.classList.add('text-center', 'text-white');
        resultadoDiv.appendChild(nombreCiudad);
        resultadoDiv.appendChild(actual);
        resultadoDiv.appendChild(temperaturaMax);
        resultadoDiv.appendChild(temperaturaMin);  

        //finalmente lo agregamos a la const resultado que hicimos al principio
        resultado.appendChild(resultadoDiv);  
           

}

//creamos una funcion con destroy para pasar la temperatura en grados 
const KelvinACentigrados= grados=> parseInt(grados - 273.15);    


function limpiarHTML() {
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }
}