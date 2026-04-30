// utils/config-negocio.js - VERSIÃ“N MULTI-TENANT CORREGIDA
// CLIENTE: Tulip SalÃ³n 

console.log('ðŸ¢ config-negocio.js cargado');

// ============================================
// ðŸ”¥ CONFIGURACIÃ“N POR CLIENTE - Â¡LO ÃšNICO QUE CAMBIA!
// ============================================
const NEGOCIO_ID_POR_DEFECTO = '1d66b0a1-040e-49e6-9e1e-b69a605d6c18'; // ID de Tulip SalÃ³n 

// Hacer accesible globalmente
window.NEGOCIO_ID_POR_DEFECTO = NEGOCIO_ID_POR_DEFECTO;

// ============================================
// FUNCIONES PARA OBTENER EL ID (GLOBALES)
// ============================================
window.getNegocioId = function() {
    return NEGOCIO_ID_POR_DEFECTO;
};

window.getNegocioIdFromConfig = function() {
    return NEGOCIO_ID_POR_DEFECTO;
};

// Cache de configuraciÃ³n
let configCache = null;
let ultimaActualizacion = 0;
const CACHE_DURATION = 2 * 60 * 1000; // 2 minutos

/**
 * Obtiene el negocio_id del localStorage o usa el ID por defecto
 */
function getNegocioId() {
    // 1. Prioridad: lo que haya en localStorage (cuando el admin se loguea)
    const localId = localStorage.getItem('negocioId');
    if (localId) {
        console.log('ðŸ“Œ Usando negocioId de localStorage:', localId);
        return localId;
    }
    
    // 2. Si no, usar el ID por defecto
    console.log('ðŸ“Œ Usando negocioId por defecto (quemado en cÃ³digo):', NEGOCIO_ID_POR_DEFECTO);
    return NEGOCIO_ID_POR_DEFECTO;
}

/**
 * Carga la configuraciÃ³n del negocio desde Supabase
 */
window.cargarConfiguracionNegocio = async function(forceRefresh = false) {
    const negocioId = getNegocioId();
    if (!negocioId) {
        console.error('âŒ No hay negocioId disponible');
        return null;
    }

    // Usar cachÃ© si no se fuerza refresco
    if (!forceRefresh && configCache && (Date.now() - ultimaActualizacion) < CACHE_DURATION) {
        console.log('ðŸ“¦ Usando cache de configuraciÃ³n');
        return configCache;
    }

    try {
        console.log('ðŸŒ Cargando configuraciÃ³n del negocio desde Supabase...');
        console.log('ðŸ“¡ ID del negocio:', negocioId);
        
        const url = `${window.SUPABASE_URL}/rest/v1/negocios?id=eq.${negocioId}&select=*`;
        
        const response = await fetch(url, {
            headers: {
                'apikey': window.SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${window.SUPABASE_ANON_KEY}`,
                'Cache-Control': 'no-cache'
            },
            cache: 'no-store'
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('âŒ Error response:', errorText);
            return null;
        }

        const data = await response.json();
        
        // Guardar en cache
        configCache = data[0] || null;
        ultimaActualizacion = Date.now();
        
        if (configCache) {
            console.log('âœ… ConfiguraciÃ³n cargada:');
            console.log('   - Nombre:', configCache.nombre);
            console.log('   - TelÃ©fono:', configCache.telefono);
            console.log('   - Email:', configCache.email);
            console.log('   - Instagram:', configCache.instagram);
            console.log('   - Logo:', configCache.logo_url);
            
            // Guardar ID en localStorage para futuras sesiones
            const localId = localStorage.getItem('negocioId');
            if (!localId) {
                console.log('ðŸ’¾ Guardando ID en localStorage');
                localStorage.setItem('negocioId', negocioId);
            }
        } else {
            console.log('âš ï¸ No se encontrÃ³ configuraciÃ³n para el negocio');
        }
        
        return configCache;
    } catch (error) {
        console.error('âŒ Error cargando configuraciÃ³n:', error);
        return null;
    }
};

/**
 * Obtiene el nombre del negocio
 */
window.getNombreNegocio = async function() {
    const config = await window.cargarConfiguracionNegocio();
    return config?.nombre || 'Tulip SalÃ³n ';
};

/**
 * Obtiene el telÃ©fono del dueÃ±o
 */
window.getTelefonoDuenno = async function() {
    const config = await window.cargarConfiguracionNegocio();
    return config?.telefono || '55002272';
};

/**
 * Obtiene el email del negocio
 */
window.getEmailNegocio = async function() {
    const config = await window.cargarConfiguracionNegocio();
    return config?.email || 'yenilet.dumenigo@gmail.com';
};

/**
 * Obtiene el Instagram
 */
window.getInstagram = async function() {
    const config = await window.cargarConfiguracionNegocio();
    return config?.instagram || '';
};

/**
 * Obtiene el Facebook
 */
window.getFacebook = async function() {
    const config = await window.cargarConfiguracionNegocio();
    return config?.facebook || '';
};

/**
 * Obtiene el horario de atenciÃ³n
 */
window.getHorarioAtencion = async function() {
    const config = await window.cargarConfiguracionNegocio();
    return config?.horario_atencion || '';
};

/**
 * Obtiene el mensaje de bienvenida
 */
window.getMensajeBienvenida = async function() {
    const config = await window.cargarConfiguracionNegocio();
    return config?.mensaje_bienvenida || 'Â¡Bienvenida a Tulip SalÃ³n !';
};

/**
 * Obtiene el mensaje de confirmaciÃ³n
 */
window.getMensajeConfirmacion = async function() {
    const config = await window.cargarConfiguracionNegocio();
    return config?.mensaje_confirmacion || 'Tu turno ha sido reservado con Ã©xito';
};

/**
 * Obtiene el tÃ³pico de ntfy para notificaciones
 */
window.getNtfyTopic = async function() {
    const config = await window.cargarConfiguracionNegocio();
    return config?.ntfy_topic || 'tulipsalon';
};

/**
 * ðŸ”¥ NUEVA FUNCIÃ“N: Obtiene si el negocio requiere anticipo
 */
window.getRequiereAnticipo = async function() {
    const config = await window.cargarConfiguracionNegocio();
    return config?.requiere_anticipo || false;
};

/**
 * Verifica si el negocio ya estÃ¡ configurado
 */
window.negocioConfigurado = async function() {
    const config = await window.cargarConfiguracionNegocio();
    return config?.configurado || false;
};

// Precargar configuraciÃ³n al inicio
setTimeout(async () => {
    console.log('ðŸ”„ Precargando configuraciÃ³n automÃ¡tica...');
    await window.cargarConfiguracionNegocio();
}, 500);

console.log('âœ… config-negocio.js listo para Tulip SalÃ³n ');
console.log('ðŸ·ï¸  ID configurado:', NEGOCIO_ID_POR_DEFECTO);