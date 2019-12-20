# HystModal

Легкая и гибкая Javascript  библиотека для создания модальных окон.

## Преимущества.

 - **Размер - 6 kB, никаких зависимостей**. HystModal написан на чистом JavaScript, не требует подключения jQuery  или иных фреймворков для
   работы.
- **Продуманный UX**. Запрет прокрутки подложки, три способа закрытия окна, учёт полосы прокрутки, адаптивность, центрирование окна, сохранение текущих координат страницы.
- **Оформление средствами CSS.** Стили окон и подложки полностью определяются в CSS. Окна свёрстаны на Flexbox, и могут иметь любые СSS-переходы.
- **Без изменения DOM.** Открытие осуществляется только средствами CSS. Все обработчики событий на элементах внутри окна не перестанут работать.
- **A11y.** Спроектирован с учётом доступности и рекомендаций WAI-ARIA.
- **Управление фокусом.** Закрытые модальные окна не получают фокус из-за visibility:hidden. При открытии фокус замыкается внутри окна. А после закрытия возвращается назад.
- **Работает в IE11.** Без проблем работает в IE11 и всех современных браузерах.

## Как подключить?
1. Скачайте и распакуйте последнюю версию hystModal
2. Подключите hystModal.js  и hystModal.css  на веб страницу.

	   <link rel="stylesheet" href="hystmodal.min.css">
	   <script src="hystmodal.min.js"></script>

3. Поместите следующую разметку в ваш HTML  документ.

    <div class="hystmodal" id="myModal" aria-hidden="true">
        <div class="hystmodal__wrap">
                <div class="hystmodal__window" role="dialog" aria-modal="true">
                    <button data-hystclose>Закрыть</button>  
                    <!-- Ваш HTML код модального окна -->
                </div>
        </div> 
    </div>

   
**.hystmodal**  - Основной селектор модального окна. Должен иметь уникальный  id. Этот селектор не получает фокус в закрытом состоянии из-за CSS правила  visbility:hidden. Аттрибут  aria-hidden  переключается автоматически.

**.hystmodal__wrap**  - прокручиваемая область под модальным окном. В зависимости от настроек может закрывать модальное окна по клику/тапу. Этот элемент не имеет фона. Селектор  .hystmodal__shadow, затеняющий содержимое страницы добавляется автоматически при загрузке скрипта прямо перед закрывающим тегом  <body>

**.hystmodal__window**  - Блок модального окна. Для доступности рекомендуется добавить атрибут  aria-labelledby  с описанием назначения окна.

**[data-hystclose]**  - Элемент с атрибутом  data-hystclose  закрывает текущее открытое окно, если это разрешено в настройках. Может быть в любом месте внутри  .hystmodal__window
4. Разместите следующий JS код для активации и подключения модального окна:
