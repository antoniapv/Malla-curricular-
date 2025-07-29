// Espera a que todo el contenido del HTML esté cargado antes de ejecutar el script.
document.addEventListener('DOMContentLoaded', () => {
    
    // Obtiene todos los elementos que representan ramos.
    const ramos = document.querySelectorAll('.ramo');
    // Crea un mapa para encontrar fácilmente el nombre de un ramo por su ID.
    const mapaNombresRamos = new Map();
    ramos.forEach(ramo => {
        mapaNombresRamos.set(ramo.dataset.id, ramo.textContent);
    });

    // Carga los ramos aprobados desde el almacenamiento local del navegador.
    // Si no hay nada guardado, empieza con una lista vacía.
    let ramosAprobados = JSON.parse(localStorage.getItem('ramosAprobados')) || [];

    // Función para guardar el estado actual de los ramos aprobados en el navegador.
    const guardarEstado = () => {
        localStorage.setItem('ramosAprobados', JSON.stringify(ramosAprobados));
    };

    // Función para actualizar el aspecto visual de todos los ramos.
    const actualizarVisualizacion = () => {
        ramos.forEach(ramo => {
            const idRamo = ramo.dataset.id;
            const requisitos = ramo.dataset.requisitos.split(',').filter(req => req); // Filtra vacíos

            // 1. Marcar como aprobado si está en la lista.
            if (ramosAprobados.includes(idRamo)) {
                ramo.classList.add('aprobado');
                ramo.classList.remove('bloqueado');
            } else {
                ramo.classList.remove('aprobado');
                
                // 2. Verificar si los requisitos están cumplidos.
                const requisitosCumplidos = requisitos.every(req => ramosAprobados.includes(req));

                if (requisitosCumplidos) {
                    ramo.classList.remove('bloqueado'); // Desbloquear si se cumplen los requisitos.
                } else {
                    ramo.classList.add('bloqueado'); // Bloquear si no se cumplen.
                }
            }
        });
    };

    // Evento de clic para cada ramo.
    ramos.forEach(ramo => {
        ramo.addEventListener('click', () => {
            const idRamo = ramo.dataset.id;
            const requisitos = ramo.dataset.requisitos.split(',').filter(req => req);
            const isAprobado = ramosAprobados.includes(idRamo);

            // Si el ramo ya está aprobado, permitir desmarcarlo.
            if (isAprobado) {
                // Advertencia: Desmarcar un ramo puede bloquear otros que dependen de él.
                // Por simplicidad, aquí simplemente lo desmarcamos.
                ramosAprobados = ramosAprobados.filter(id => id !== idRamo);
                console.log(`Ramo "${mapaNombresRamos.get(idRamo)}" desmarcado.`);
            } else {
                // Si el ramo no está aprobado, verificar requisitos.
                const requisitosFaltantes = requisitos.filter(req => !ramosAprobados.includes(req));

                if (requisitosFaltantes.length === 0) {
                    // Si no faltan requisitos, se aprueba el ramo.
                    ramosAprobados.push(idRamo);
                    console.log(`Ramo "${mapaNombresRamos.get(idRamo)}" aprobado.`);
                } else {
                    // Si faltan requisitos, mostrar una alerta al usuario.
                    const nombresRequisitosFaltantes = requisitosFaltantes.map(id => `"${mapaNombresRamos.get(id)}"`).join(', ');
                    alert(`Para aprobar "${mapaNombresRramos.get(idRamo)}", primero necesitas aprobar: ${nombresRequisitosFaltantes}.`);
                    return; // Detiene la ejecución para no actualizar el estado.
                }
            }

            // Guardar el nuevo estado y actualizar la visualización.
            guardarEstado();
            actualizarVisualizacion();
        });
    });

    // Botón para limpiar la malla
    const resetButton = document.getElementById('resetButton');
    resetButton.addEventListener('click', () => {
        // Pide confirmación antes de borrar todo.
        if (confirm('¿Estás seguro de que quieres limpiar toda la malla? Se perderá todo tu progreso.')) {
            ramosAprobados = [];
            guardarEstado();
            actualizarVisualizacion();
            console.log('Malla limpiada.');
        }
    });

    // Llama a esta función una vez al cargar la página para establecer el estado inicial.
    actualizarVisualizacion();
});
