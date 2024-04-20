import { Leon, Lobo, Oso, Serpiente, Aguila } from "./animales.js";

const animalesRegistrados = { leon: Leon, lobo: Lobo, oso: Oso, serpiente: Serpiente, aguila: Aguila };
let claseAnimal = {};

(async function obtenerDatos() {
  try {
    const response = await fetch("animales.json");
    const { animales } = await response.json();
    let objeto = {};

    animales.forEach((elem) => {
      objeto[elem.name] = {
        clase: animalesRegistrados[elem.name],
        img: `./assets/imgs/${elem.imagen}`,
        sound: `./assets/sound/${elem.sonido}`,
      };
    });
    claseAnimal = objeto;
  }
  catch (error) {
    console.log(error);
  }
})();

function registrarDatos () {
  const formulario = $("#form");
  const animalSeleccionado = $("#animal");
  const edadSeleccionada = $("#edad");
  const textoComentarios = $("#comentarios");

  formulario.submit(function (evento) {
    evento.preventDefault();
    try {
      const { clase, img, sound } = claseAnimal[animalSeleccionado.val()];
      const objeto = new clase(
        animalSeleccionado.val(),
        edadSeleccionada.val(),
        img,
        textoComentarios.val(),
        sound
      );

      function resetFormulario() {
        document.getElementById("animal").value = "";
        document.getElementById("edad").value = "";
        document.getElementById("comentarios").value = "";
        const img = $("#preview");
        img.attr("src", "./assets/imgs/lion.svg");
      };

      function mostrarAnimalAgregado(objetoAnimal) {
        const imagenAnimal = objetoAnimal.img;
        const contenedorAnimales = $(".contenedor_animales");
        const contenedorAnimal = $("<div>");
        contenedorAnimal.addClass("animal_insertado");
        const contenido = `
            <img src=${imagenAnimal} alt=${objetoAnimal.nombre}/>
            <button class="boton_sonido" type="button" data-sonido=${objetoAnimal.sonido}>
              <i class="fa-solid fa-volume-high"></i>
            </button>
        `;
        contenedorAnimal.html(contenido);
        contenedorAnimales.append(contenedorAnimal);
        return contenedorAnimal;
      };

      const reproducirSonido = (elementoAgregado) => {
        const botonSonido = elementoAgregado.find(".boton_sonido");
        botonSonido.on("click", function () {
          const audioTag = $("#player");
          audioTag.html(`<source src=${$(this).attr("data-sonido")} type="audio/mpeg">`);
          audioTag[0].load();
          audioTag.on("loadedmetadata", () => {
            audioTag[0].play();
          });
        });
      };

      function cargarModal(elementoAgregado, objeto) {
        const imgTag = elementoAgregado.find("img");
        imgTag.on("click", () => {
          const modalTag = $("#Modal");

          modalTag.find(".modal-body").html(`
          <img src=${imgTag.attr("src")} alt="">
          <p>Edad: ${objeto.edad}</p>
          <p class="modal-comentarios">Comentarios</p>
          <p class="modal-contenido">${objeto.comentarios}</p>
          `);
          const mostrarModal = new bootstrap.Modal(modalTag[0]);
          mostrarModal.show();
        });
      };

      resetFormulario();
      const animalAgregado = mostrarAnimalAgregado(objeto);
      reproducirSonido(animalAgregado);
      cargarModal(animalAgregado, objeto);
    }

    catch (error) {
      console.log(error);
    }

  });

  const cargarImagen = (() => {
    return async function (srcImagen) {
      const promesaDeCarga = new Promise(() => {
        const img = $("#preview");
        img.attr("src", srcImagen);
      });
      try {
        const resultado = await promesaDeCarga;
      }
      catch (error) {
        console.log(error);
      }
    };
  })();

  animalSeleccionado.change(function () {
    try {
      const { img } = claseAnimal[animalSeleccionado.val()];
      cargarImagen(img);
    }
    catch (error) {
      console.log(error);
    }
  });
};

registrarDatos();

window.onload = () => {
  document.getElementById("animal").value = "";
  document.getElementById("edad").value = "";
  document.getElementById("comentarios").value = "";
};
