# nano-messaging

Nano messaging es una PoC para un sistema de mensajería basado en pubsub para una pequeña startup.
Funciona mediante websockets y una instancia de redis para coordinar los mensajes


Dado que es una prueba de concepto, el código está desordenado y no es tan descriptivo. Parte del desafío para usar este código bien es entender la arquitectura y las implicancias de las decisiones que se hicieron en esta PoC

El diagrama se puede encontrar en E3-nano-messaging

## Features

* Sistema de mensajes escalable en base a pubsub
* Historial de mensajes
* Manejo de usuarios en base a rooms
* Uso de JWT para

## Stack

* Koa
* 