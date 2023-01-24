import CryptoJS from "crypto-js";

const dragArea = document.querySelector(".drag-area");
const dragText = dragArea.querySelector('h2');
const button = dragArea.querySelector('button');
const input = dragArea.querySelector('#input-file');

let trimmedValue;


let archivo;
let archivoUrl;

let stringEncriptado;

let key;
let keyValue;

let output;

let btnEncripta;
let btnDescarga;

const validationResult = {};


/* Carga drag and drop */
dragArea.addEventListener('dragover', (e) => {
  e.preventDefault();
  dragArea.classList.add('active');
  dragText.textContent = 'Suelta para cargar tu archivo';
})

dragArea.addEventListener('dragleave', (e) => {
  e.preventDefault();
  dragArea.classList.remove('active');
  dragText.textContent = 'Arrastra y suelta tu archivo';
})

dragArea.addEventListener('drop', (e) => {
  e.preventDefault();
  archivo = e.dataTransfer.files[0];
  dragArea.classList.remove('active');
  dragText.textContent = 'Arrastra y suelta tu archivo';
  archivoToUrl();
})


/* Carga manual de archivo */

button.addEventListener('click', e => {
  input.click();
})

input.addEventListener('change', e => {
  dragArea.classList.add('active');
  archivo = e.target.files[0];
  dragArea.classList.remove('active');
  archivoToUrl();
})

function archivoToUrl() {
  const fileReader = new FileReader();

  fileReader.readAsDataURL(archivo);

  fileReader.addEventListener('load', e => {
    archivoUrl = e.target.result;
    inputDatos();
  })
}

function inputDatos() {
  dragArea.classList.add('drag-area--encripta');
  dragArea.innerHTML = `<div class="encriptaFlex contenedor"> 
                            <div>
                                <h3>Elige una contraseña:</h3><input id="key" type="text">
                                <p class="parrafoMinimo">Debe tener mínimo 8 caracteres</p>
                                <p class="parrafoMayus">Debe incluir una letra mayúscula</p>
                                <p class="parrafoMinus">Debe incluir una letra minúscula</p>
                                <p class="parrafoNum">Debe incluir un número</p>
                                <p class="parrafoEspecial">Debe incluir un caracter especial</p>
                            </div> 

                            <div class="botonesFlex">
                                <button id="btnEncripta" class="btnPrincipal">Encripta</button>
                                <a id="enlace"><button id="btnDescarga" class="btnDescargaDenied" disabled>Descarga</button></a>
                            </div>

                            <div class="output">
                              <textarea id="output"></textarea>
                            </div>

                        </div>`;
  // console.log(archivoUrl);

  key = document.getElementById('key');
  key.addEventListener('input', validaKey);

  btnEncripta = document.getElementById('btnEncripta');
  btnEncripta.addEventListener('click', encripta);

  btnDescarga = document.getElementById('btnDescarga');
  btnDescarga.addEventListener('click', descarga);

  output = document.getElementById('output');
}

function validaKey() {

  keyValue = key.value;

  trimmedValue = keyValue.trim();
  const MINIMUM_LENGTH = 8;
  const mayus = /[A-Z]/;
  const minus = /[a-z]/;
  const number = /[0-9]/;
  const caracteresEspeciales = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

  validationResult.minimumLength = trimmedValue.length >= MINIMUM_LENGTH;
  validationResult.containsMayus = mayus.test(trimmedValue);
  validationResult.containsMinus = minus.test(trimmedValue);
  validationResult.containsEspecial = caracteresEspeciales.test(trimmedValue);
  validationResult.containsNumber = number.test(trimmedValue);

  const parrafoEspecial = document.querySelector('.parrafoEspecial');
  const parrafoMayus = document.querySelector('.parrafoMayus');
  const parrafoMinus = document.querySelector('.parrafoMinus');
  const parrafoMinimo = document.querySelector('.parrafoMinimo');
  const parrafoNum = document.querySelector('.parrafoNum');

  if( validationResult.minimumLength ) {
    parrafoMinimo.classList.remove('error');
    parrafoMinimo.classList.add('validado');
  } else {
    parrafoEspecial.classList.remove('validado');
    parrafoMinimo.classList.add('error');
  }
  if( validationResult.containsMayus ) {
    parrafoMayus.classList.remove('error');
    parrafoMayus.classList.add('validado');
  } else {
    parrafoMayus.classList.remove('validado');
    parrafoMayus.classList.add('error');
  }
  if( validationResult.containsMinus ) {
    parrafoMinus.classList.remove('error');
    parrafoMinus.classList.add('validado');
  } else {
    parrafoMinus.classList.remove('validado');
    parrafoMinus.classList.add('error');
  }
  if( validationResult.containsEspecial ) {
    parrafoEspecial.classList.remove('error');
    parrafoEspecial.classList.add('validado');
  } else {
    parrafoEspecial.classList.remove('validado');
    parrafoEspecial.classList.add('error');
  }
  if( validationResult.containsNumber ) {
    parrafoNum.classList.remove('error');
    parrafoNum.classList.add('validado');
  } else {
    parrafoNum.classList.remove('validado');
    parrafoNum.classList.add('error');
  }

}

let keyHash;

function encripta() {
  if(validationResult.minimumLength && validationResult.containsMayus && validationResult.containsMinus && validationResult.containsNumber && validationResult.containsEspecial) {
      keyHash = CryptoJS.MD5(trimmedValue).toString()
      stringEncriptado = CryptoJS.TripleDES.encrypt(archivoUrl, keyHash).toString();
      output.innerText = stringEncriptado;
      btnDescarga.classList.remove('btnDescargaDenied');
      btnDescarga.classList.add('btnPrincipal');
      btnDescarga.setAttribute('disabled', 'false');

      btnDescarga = document.getElementById('btnDescarga').disabled = false;
  } else {
    Swal.fire({
      icon: 'error',
      title: 'La contraseña no cumple con los requisitos',
      showConfirmButton: false,
      timer: 1500
    })
  }
}


function descarga() {
  const enlace = document.getElementById('enlace');
  enlace.setAttribute('href', 'data:text/plain;charset=utf-8, ' + encodeURIComponent(stringEncriptado));
  enlace.setAttribute('download', 'encriptado');
}