function createSelector(selectorFn) {
  return function (state, params) {
    const steps = []; // Массив для хранения всех шагов доступа (путей) к значениям в state и params.

    function createTrackingProxy(target, basePath = []) {
      // Если target не объект  или null, то просто возвращаем его как есть
      if (typeof target !== "object" || target === null) return target;

      return new Proxy(target, {
        get(obj, prop) {
          // Формируем новый путь доступа, добавляя текущее свойство prop.
          const newPath = [...basePath, prop];
          // Сохраняем путь доступа в массив steps.
          steps.push(newPath);
          // Получаем значение свойства из оригинального объекта obj.
          const value = obj[prop];
          // Рекурсивно создаём прокси для вложенных объектов (если value — объект).
          return createTrackingProxy(value, newPath);
        },
        // Перехватываем проверку наличия свойства в объекте через оператор in (has).
        has(obj, prop) {
          // Сохраняем путь к свойству, к которому был доступ.
          steps.push([...basePath, prop]);
          // Проверяем, существует ли свойство prop в объекте obj.
          return prop in obj;
        },
      });
    }

    // Создаем прокси для state, который будет отслеживать обращения, начиная с пути 'arg0'.
    const trackedState = createTrackingProxy(state, ["arg0"]);
    // Создаем прокси для params, который будет отслеживать обращения, начиная с пути 'arg1'.
    const trackedParams = createTrackingProxy(params, ["arg1"]);

    // Возвращаем объект с результатом работы селектора и шагами доступа (steps).
    return {
      result: selectorFn(trackedState, trackedParams),
      steps,
    };
  };
}
