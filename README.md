# muzlo-template

This project is generated with [yo angular generator](https://github.com/yeoman/generator-angular)
version 0.15.1.

## Build & development

Run `grunt` for building and `grunt serve` for preview.

## Testing

Running `grunt test` will run the unit tests with karma.

Логика проигрывания шаблонов во времени

1. Нажимаем на кнопку плей или ресет первый раз

Если текущее время лежит в диапазоне времени текущего шаблона, то прогрыванием его *

Если нет, то ищем подходящий шаблон в цикле и проигрываем его

Если нет такого шаблона, то ничего не делаем

2. Нажимаем на кнопку плей, если была пауза

Если текущее время лежит в диапазоне времени текущего шаблона, то продолжаем воспроизводить его

Если нет, то ищем подходящий шаблон в цикле и проигрываем его

Если нет такого шаблона, то все останавливаем

3. Во время проигрывания проверяем текущее время, если оно выходит за рамки шаблона, то останавливаем все и

ищем подходящий шаблон, если его нет, то ничего не делаем.


Логика проигрывания рекламных треков:

1. Создаем аудиосервис для рекламы

2. Ставим таймер с временем в зависимости от настроек.

Как только таймер срабатывает, то сбрасываем его. Воспроизводим рекламный ролик. После окончания воспроизведения 

снимаем с паузы музыку и увеличиваем номер релакмного трека на 1
