// src/utils/typeIcons.ts

// Importamos dinámicamente todos los iconos SVG de la carpeta src/assets/types
// Vite/Webpack maneja esto y te dará las URLs correctas para cada SVG.
// Ajusta el patrón '../assets/types/*.svg' si tu carpeta tiene otro nombre o extensión
const typeIconMap: { [key: string]: string } = import.meta.glob('../assets/types/*.svg', { eager: true, as: 'url' });

// Función para obtener la URL del icono de un tipo dado
export const getTypeIconUrl = (typeName: string): string => {
  // El nombre de archivo del icono debe coincidir con el nombre del tipo (ej. 'fire.svg' para 'fire')
  const iconPath = `../assets/types/${typeName.toLowerCase()}.svg`;
  
  // Verificamos si el icono existe en nuestro mapa de importaciones
  if (typeIconMap[iconPath]) {
    return typeIconMap[iconPath];
  }
  
  // Si no se encuentra, puedes devolver un icono por defecto o un string vacío
  // Por ahora, devolveremos un string vacío si no se encuentra el icono
  console.warn(`Icono para el tipo "${typeName}" no encontrado en: ${iconPath}`);
  return ''; // Puedes poner aquí una URL de un icono de tipo "desconocido" si quieres
};