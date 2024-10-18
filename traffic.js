class Traffic {
  constructor(initialSignal, trafficLightController) {
    this.currentSignal = initialSignal;
    this.trafficLightController = trafficLightController;
    this.waiting = {}; // Очередь ожидающих направлений

    //подпишемся на обновление контроллера светофора
    this.trafficLightController.subscribe((currentSignal) => {
      this.currentSignal = currentSignal;
      this.check(); // Проверяем очередь при изменении сигнала
    });
  }

  async go(direction) {
    return new Promise((resolve, reject) => {
      //&& FORWARD нужно добавить
      if (this.currentSignal === "GREEN" || this.currentSignal === direction) {
        resolve(); // Разрешаем движение, если сигнал зеленый или совпадает с направлением
      } else {
        this.add(direction, resolve); // Добавляем в очередь ожидания
      }

      this.clear();
    });
  }

  // Метод для добавления направления в очередь ожидания
  add(direction, resolve) {
    // Если для направления еще нет очереди ожидания, создаем массив
    if (!this.waiting[direction]) {
      this.waiting[direction] = [];
    }
    this.waiting[direction].push(resolve); // Добавляем в очередь ожидания для данного направления
  }

  // Метод для проверки очереди и разрешения движения, если это возможно
  check() {
    if (this.currentSignal === "GREEN") {
      //пробежимся по всем направлениям в очереди
      for (const direction in this.waiting) {
        //если в очереди есть ожидающие,
        // извлечем первого из очереди и разрешим ему движение
        if (this.waiting[direction]?.length > 0) {
          const nextInQueue = this.waiting[direction].shift();
          nextInQueue(); // Выполняем следующее действие в очереди для данного направления
        }
      }
    }
  }

  // Метод для очистки и обработки очереди ожидания,
  //если текущий сигнал соответствует направлению
  clear() {
    //пробежимся по всем направлениям из очереди
    for (const direction in this.waiting) {
      //если для направления есть ожидающие и текущий сигнал соответсвует направлению
      if (
        this.waiting[direction]?.length > 0 &&
        this.currentSignal === direction
      ) {
        // Извлекаем участников, которые не успели проехать
        //(оставляем только второго и далее).
        const remainingParticipants = this.waiting[direction].splice(1); // Участники, которые не успели проехать
        // Переносим этих участников в конец очереди
        this.waiting[direction] = this.waiting[direction].concat(
          remainingParticipants
        ); // Переносим их в конец очереди

        // Разрешаем движение следующему участнику в очереди.
        const nextInQueue = this.waiting[direction].shift();
        nextInQueue(); // Выполняем следующее действие в очереди для данного направления
      }
    }
  }
}

exports.Traffic = Traffic;
