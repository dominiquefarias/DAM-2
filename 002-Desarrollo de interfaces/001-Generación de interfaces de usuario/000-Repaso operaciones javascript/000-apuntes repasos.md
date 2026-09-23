## Tipos de datos
undefined — significa que una variable existe pero no tiene valor asignado.

    // undefined
    let x;              // x es undefined porque no tiene valor

null — representa ausencia intencional de valor, como “esto está vacío”.

    // null
    let y = null;       // y está vacío a propósito

string — texto entre comillas, como "hola" o "123".

    // string
    let texto = "Hola"; // texto es un string

number — cualquier número, entero o decimal, como 5 o 3.14.

    // string
    let texto = "Hola"; // texto es un string

boolean — solo puede ser true o false, usado para condiciones.

    // boolean
    let activo = true;  // activo es boolean

object — conjunto de datos en forma de pares clave‑valor, como {nombre: "Ruth"}.

    // object
    let persona = { nombre: "Ruth", edad: 28 }; // object

array — lista ordenada de valores, como [1, 2, 3].

    // array
    let lista = [1, 2, 3]; // array

function — bloque de código que se ejecuta cuando lo llamas, como function saludar() {}.

    // function
    function saludar() { return "Hola"; } // function

symbol — identificador único que nunca se repite.

    // symbol
    let id = Symbol("unico"); // symbol único

bigint — números enormes que no caben en un number normal.

    // bigint
    let grande = 123456789012345678901234567890n; // bigint

## Operadores lógicos

 || --> OR  → devuelve true si al menos una condición es verdadera.

 && --> AND → devuelve true solo si todas las condiciones son verdaderas.

## Comparadores 

 == --> mira si “parecen iguales” 

 === --> mira si “son exactamente iguales”. (El tipo de dato incluido). Para las comparaciones

  Ejemplo:

    5 == "5" → true (porque parecen iguales, los dos son 5)

    5 === "5" → false (porque uno es número y el otro es texto)

 != → comprueba si los valores son distintos haciendo conversión de tipo.

 !== → comprueba si valores y tipos son distintos sin conversión.

 > → verdadero si el valor de la izquierda es mayor que el de la derecha.

 < → verdadero si el valor de la izquierda es menor que el de la derecha.

 >= → verdadero si el valor de la izquierda es mayor o igual.

 <= → verdadero si el valor de la izquierda es menor o igual.



##  + y $
 + --> une cadenas d caracteres y variables.
 Ejemplo:

 const nombre = "Ana"
 const edad = 22;

 Console.log(
     "Hola" + nombre + "tienes" + edad + "años
 );

 Otra forma de hacer conexiones es con $, asi es de forma mas compacta:


 Console.log(
     "Hola ${nombre}, tienes ${edad} años"
 );

## Comentarios 

 De una linea :  // Esto es un comentaria

 De varias lineas:  

                    /* 
                        Esto es un comentario
                        Esto sigue siendo el comentario
                     * /

## Condicionales

 if --> ejecuta un bloque si la condición es verdadera

 else --> ejecuta otro bloque si es falsa

 else if --> añade una nueva condición cuando la primera no se cumple.

## Bucles

 for --> Se usa cuando sabes cuántas veces quieres repetir algo.

 Ejemplo:
        for (let i = 0; i < 5; i++) {
            console.log(i);
        }

 while --> Se ejecuta mientras la condición sea verdadera.
 
  Ejemplo:

        let i = 0;

        while (i < 5) {
            console.log(i);
            i++;
        }
 
 do...while --> Igual que while, pero siempre ejecuta una vez antes de comprobar la condición.

  Ejemplo:

        let i = 0;

        do {
            console.log(i);
            i++;
        } while (i < 5);

 for...of --> Recorre los valores de arrays, strings u objetos iterables.

  Ejemplo:

        const numeros = [10, 20, 30];

        for (let n of numeros) {
            console.log(n);
        }

 forEach --> Método de los arrays para ejecutar una función por cada elemento.
  
  Ejemplo:

        [1, 2, 3].forEach(num => console.log(num));