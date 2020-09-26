# HystModal

Легкая и гибкая Javascript  библиотека для создания модальных окон.

[Документация](https://addmorescripts.github.io/hystModal/index_ru.html)

## Преимущества.

 - **Размер - 3 kB (gzip), никаких зависимостей**. HystModal написан на чистом JavaScript, не требует подключения jQuery  или иных библиотек для работы.
- **Продуманный UX**. Запрет прокрутки подложки, три способа закрытия окна, учёт полосы прокрутки, адаптивность, центрирование окна, сохранение текущих координат страницы.
- **Оформление средствами CSS.** Стили окон и подложки полностью определяются в CSS. Окна свёрстаны на Flexbox, и могут иметь любые СSS-переходы.
- **Без изменения DOM.** Открытие осуществляется только средствами CSS. Все обработчики событий на элементах внутри окна не перестанут работать.
- **A11y.** Спроектирован с учётом доступности и рекомендаций WAI-ARIA.
- **Управление фокусом.** Закрытые модальные окна не получают фокус из-за visibility:hidden. При открытии фокус замыкается внутри окна. А после закрытия возвращается назад.
- **Работает в IE11.** Без проблем работает в IE11 и всех современных браузерах.

## Как подключить?
1. Скачайте и распакуйте последнюю версию hystModal
2. Подключите hystmodal.min.js и hystmodal.min.css из папки dist на веб страницу.

		<link rel="stylesheet" href="hystmodal.min.css">
		<script src="hystmodal.min.js"></script>

3. Поместите следующую разметку внурь тега body вашего HTML документа.

		<div class="hystmodal" id="myModal" aria-hidden="true">
			<div class="hystmodal__wrap">
				<div class="hystmodal__window" role="dialog" aria-modal="true">
					<button data-hystclose class="hystmodal__close">Закрыть</button>  
					<!-- Ваш HTML код модального окна -->
				</div>
			</div> 
		</div>

   
**.hystmodal**  - Основной селектор модального окна. Должен иметь уникальный  id. Этот селектор не получает фокус в закрытом состоянии из-за CSS правила  visbility:hidden. Аттрибут  aria-hidden  переключается автоматически.

**.hystmodal__wrap**  - прокручиваемая область под модальным окном. В зависимости от настроек может закрывать модальное окна по клику/тапу. Этот элемент не имеет фона. Селектор  .hystmodal__shadow, затеняющий содержимое страницы добавляется автоматически при загрузке скрипта прямо перед закрывающим тегом  <body>

**.hystmodal__window**  - Блок модального окна. Для доступности рекомендуется добавить атрибут  aria-labelledby  с описанием назначения окна.

**[data-hystclose]**  - Элемент с атрибутом  data-hystclose  закрывает текущее открытое окно, если это разрешено в настройках. Может быть в любом месте внутри  .hystmodal__window

4. Разместите следующий JS код для активации и подключения модального окна:

		const myModal = new HystModal({
			linkAttributeName: "data-hystmodal",
			//настройки, см. API
		});

5.Добавьте атрибут data-hystmodal к элементу открывающему модальное окно. Значением может быть идентификатор или имя класса окна. например:

	<a href="#" data-hystmodal="#myModal">Показать окно с id=myModal</a>

Название data-атрибута, который открывает окна определяется значением cсвойства linkAttributeName объекта настроек. По умолчанию он равен data-hystmodal.

6.При необходимости измените настройки.


## Конфигурация

|Название свойства|Тип|Начальное значение|Описание|
|--|--|--|--|
|linkAttributeName|String|"data-hystmodal"|Определяет data-атрибут элемента, клик по которому открывает модальное окно. Значение этого атрибута должно соответствовать селектору окна, которое необходимо открыть. Если не задано, то обработчики событий задействованы не будут.|
|closeOnOverlay|Bolean|true|Разрешает/запрещает закрывать окна кликом/тапом на оверлей. (элемент с классом .hystmodal__wrap )|
|closeOnEsc|Bolean|true|Разрешает/запрещает закрывать окна с клавиатуры, нажатием ESC.|
|closeOnButton|Bolean|true|Разрешает/запрещает закрывать окно по клику на элемент с атрибутом data-hystclose. Если имеется несколько элементов с этим атрибутом, окно закроется по клику на любой из них.|
|waitTransitions|Bolean|false|Если true – закрытие окна произойдёт после завершения css-перехода на элементе .hystmodal__window. Если false – закрытие окна будет мгновенным. Чтобы и открытие также проходимо мгновенно – удалите CSS свойство transition для .hystmodal__window и установите waitTransitions:false.|
|catchFocus|Bolean|true|Если true – при открытии зацикливает фокус на активных элементах внутри окна. При закрытии окна – фокус возвращается на предыдущий селектор.|
|beforeOpen|function|Пустая функция|Функция обратного вызова. Запускается перед открытием окна. В функцию передаётся объект модального окна окна.|
|afterClose|function|Пустая функция|Функция обратного вызова. Запускается после закрытия окна. В функцию передаётся объект последнего модального окна.|

## Пример конфигурации

	const myModal = new HystModal({
		linkAttributeName: 'data-hystmodal',
		catchFocus: true,
		waitTransitions: true,
		closeOnEsc: false,
		beforeOpen: function(modal){
			console.log('Message before opening the modal');
			console.log(modal); //modal window object
		},
		afterClose: function(modal){
			console.log('Message after modal has closed');
			console.log(modal); //modal window object
		},
	});

## API

При создании экземпляра класса HystModal командой new HystModal({ ... }), в переменной myModal будет находится объект, имеющий свойства и методы.

### Свойства

|Название свойства|Тип|Описание|
|--|--|--|
|isOpened|Bolean|Индикатор открытия окна. True – окно открыто в текущий момент. По умолчанию – false. Некоторые приватные методы ориентируются на значение данного свойства.|
|openedWindow|DOM node|Селектор открытого окна. Если окно закрыто – содержит селектор последнего открытого окна.|
|starter|DOM node|Селектор с которого было открыто модальное окно. Используется для возвращения фокуса на элемент.|
|config|object|Объект настроек. См. конфигурация.|


### Методы


|Название метода|Описание|
|--|--|
|init()|Инициализирует функционал модальных окон и подключает обработку событий на странице. Если свойство linkAttributeName не равно false, то init запускается автоматически при создании экземпляра класса HystModal.modal. Вы можете указать linkAttributeName:false, а позже присвоить ему значение (например myModal.config.linkAttributeName = 'data-othermodal'), тогда вручную вызовите myModal.init(). Инициализация может происходить только один раз.|
|open(selector)|Открывает модальное окно. selector – селектор окна в виде строки, например, myModal.open(“#modal-1”). Если «selector» не передан – открывается последнее открытое окно, либо не происходит никаких действий. Если новое окно открывается пока старое не закрыто, сначала происходит закрытие предыдущего окна, а после открывается новое.|
|close()|Закрывает текущее открытое модальное окно.|