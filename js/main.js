// LS usuario

let usuarioRegistrado = []
// Traigo el JSON de medicos existentes:

let medicosExistentes = []

fetch("./js/medicos.json")
    .then(response => response.json())
    .then(data => {
        medicosExistentes = data;
        cargarMedicosDisponibles(medicosExistentes)
    })

let turnosAgendadosArray = localStorage.getItem("medicos-en-carrito")
turnosAgendadosArray = JSON.parse(turnosAgendadosArray)

// ------------DOM------------ //
const contenedorMedicosDisponibles = document.querySelector("#container-medicos-disponibles")
const contenedorTurnosAgendados = document.querySelector("#container-turnos-agendados")
const btnConfirmar = document.querySelector("#btnConfirmar")
const btnVaciar = document.querySelector("#btnVaciar")
const btnContactoConfirmar = document.querySelector("#btnContactoConfirmar")

// --- DOM del formulario --- //
const formRegistro = document.querySelector("#formulario")
const nombreForm = document.querySelector("#nombreForm")
const apellidoForm = document.querySelector("#apellidoForm")
const correoForm = document.querySelector("#correoForm")
const documentoForm = document.querySelector("#dniForm")

// Cargar a los medicos a la pagina

function cargarMedicosDisponibles() {
    contenedorMedicosDisponibles.innerHTML = ""

    medicosExistentes.forEach(medico => {
        const div = document.createElement("div")
        div.classList.add("medicos-js-main", "js-separador")
        div.innerHTML = `
        <img src="${medico.imagen}" alt="" class="medicos-foto">
        <div class="medicos-nombre var-color-js">
            <small>Nombre</small>
            <p>${medico.nombre}</p>
        </div>
        <div class="medicos-especialidad">
            <small>Especialidad</small>
            <p>${medico.especialidad}</p>
        </div>
        <div class="medicos-plan var-color-js">
            <small>Plan de Salud</small>
            <p>${medico.plan}</p>
        </div>   
        <div class="medicos-horario">
            <small>Franja horaria</small>
            <p>${medico.horario}</p>
        </div>
            <button class="medico-agregar-btn" id="${medico.id}">Agregar turno</button>
        </div>
        `;
        contenedorMedicosDisponibles.append(div)

        // Boton para agregar turno al "carrito"

        const botonAgregarMedico = document.getElementById(`${medico.id}`)

        botonAgregarMedico.addEventListener("click", () => {
            agregarATurnos(medico.id)
        })

    })
}
cargarMedicosDisponibles();

// Agregar turno al "carrito"

const agregarATurnos = (medID) => {

    Toastify({
        text: "Turno agregado",
        duration: 1600,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
            background: "linear-gradient(to right, white 24%, cadetblue 100%)",
            color: "rgba(19, 5, 2, 0.70)",
        },
        onClick: function () { }
    }).showToast();

    const medSelect = medicosExistentes.find((medico) => medico.id === medID)
    turnosAgendadosArray.push(medSelect)
    console.log(turnosAgendadosArray)
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    localStorage.setItem("medicos-en-turnos", JSON.stringify(turnosAgendadosArray))
    cargarTurnosAgendados();

}


// Cargar al "carrito" de turnos 

function cargarTurnosAgendados() {
    contenedorTurnosAgendados.innerHTML = ""

    turnosAgendadosArray.forEach(medico => {
        const div = document.createElement("div")
        div.classList.add("medicos-js-turnos", "js-separador")
        div.innerHTML = `
        <img src="${medico.imagen}" alt="" class="medicos-foto">
        <div class="medicos-nombre var-color-js">
            <small>Nombre</small>
            <p>${medico.nombre}</p>
        </div>
        <div class="medicos-especialidad">
           <small>Especialidad</small>
            <p>${medico.especialidad}</p>
        </div>
        <div class="medicos-plan var-color-js">
            <small>Plan de Salud</small>
            <p>${medico.plan}</p>
        </div>   
        <div class="medicos-horario">
            <small>Franja horaria</small>
            <p>${medico.horario}</p>
        </div>
            <button class="medico-remover-btn" id="remover ${medico.id}">Remover turno</button>
        </div>
         `;
        contenedorTurnosAgendados.append(div)

        // Boton para eliminar turnos

        const botonRemoverMedico = document.getElementById(`remover ${medico.id}`)

        botonRemoverMedico.addEventListener("click", () => {

            Toastify({
                text: "Turno removido",
                duration: 1200,
                gravity: "top",
                position: "right",
                stopOnFocus: true,
                style: {
                    background: "linear-gradient(to right, white 14%, red 100%)",
                    color: "rgba(19, 5, 2, 0.70)",
                },
                onClick: function () { }
            }).showToast();

            quitarDeTurnos(medico.id)
        })
    })
}

// Quitar del "carrito" de turnos

const quitarDeTurnos = (medID) => {
    const medSelect = turnosAgendadosArray.find((medico) => medico.id === medID)
    const findIndice = turnosAgendadosArray.indexOf(medSelect)
    turnosAgendadosArray.splice(findIndice, 1)
    console.log(turnosAgendadosArray)
    localStorage.setItem("medicos-en-turnos", JSON.stringify(turnosAgendadosArray))
    cargarTurnosAgendados();

}

// Botones de vacio y de confirmacion

function confirmarTurno() {
    if (turnosAgendadosArray.length === 0) {
        Swal.fire({
            icon: 'warning',
            title: '¡Ojo!',
            text: 'No tenés ningun turno agendado, por favor intenta de nuevo',
        })
    } else {
        Swal.fire({
            title: 'Estás por confirmar los turnos, ¿deseas finalizar?',
            showDenyButton: true,
            confirmButtonText: 'Finalizar',
            confirmButtonColor: `#17594A`,
            denyButtonText: `Continuar agregando`,
            denyButtonColor: `#D7C0AE`
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire('¡Confirmaste con éxito los turnos!', '', 'success')
            }
        })
    }
}

btnVaciar.addEventListener("click", () => {
    if (turnosAgendadosArray.length === 0) {
        Toastify({
            text: "No tenes turnos en la agenda para vaciar",
            duration: 2500,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: {
                background: "linear-gradient(to right, white 14%, red 100%)",
                color: "rgba(19, 5, 2, 0.70)",
            },
            onClick: function () { }
        }).showToast();
    } else if (contenedorTurnosAgendados.innerHTML !== "") {
        Swal.fire({
            title: '¿Deseas vaciar todos los turnos agendados?',
            showDenyButton: true,
            confirmButtonText: 'Vaciar',
            confirmButtonColor: `rgba(145, 14, 14, 0.918)`,
            denyButtonText: `Volver atrás`,
            denyButtonColor: `#D7C0AE`
        }).then((result) => {
            if (result.isConfirmed) {
                turnosAgendadosArray.length = 0
                localStorage.clear("medicos-en-turnos", JSON.stringify(turnosAgendadosArray))
                cargarTurnosAgendados()
                Toastify({
                    text: "Vaciaste el carrito de compras",
                    duration: 1200,
                    gravity: "top",
                    position: "right",
                    stopOnFocus: true,
                    style: {
                        background: "linear-gradient(to right, white 14%, red 100%)",
                        color: "rgba(19, 5, 2, 0.70)",
                    },
                    onClick: function () { }
                }).showToast();
            } else { }
        })
    }
})

// Carrito de turnos LS (no logré dejar cargado el LS al recargar la pagina)

let turnosAgendadosLS = localStorage.getItem("productos-en-carrito");

if (turnosAgendadosLS) {
    turnosAgendadosArray = JSON.parse(turnosAgendadosLS);
    cargarTurnosAgendados();
} else {
    turnosAgendadosArray = [];
}

// Formulario - Registro de "usuario"

formRegistro.addEventListener("submit", (event) => {
    event.preventDefault();
    Swal.fire({
        title: '¿Estas seguro?',
        text: "Puedes modificar alguna variable si la has introducido correctamente",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: 'rgb(82, 94, 128)',
        cancelButtonColor: 'rgb(226, 6, 6)',
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Volver',
    }).then((result) => {
        if (result.isConfirmed) {
            const personaRegistrada = {
                nombre: nombreForm.value,
                apellido: apellidoForm.value,
                correo: correoForm.value,
                documento: dniForm.value,
            };
            Swal.fire(
                '¡Registro exitoso!',
                `Bienvenido/a, ${personaRegistrada.nombre}, registramos correctamente tus datos: <br> Usuario: ${personaRegistrada.apellido}, ${personaRegistrada.nombre} <br> Correo: ${personaRegistrada.correo} <br> DNI/Pasaporte: ${personaRegistrada.documento}`,
                'success'
            )
        }
    });
});

