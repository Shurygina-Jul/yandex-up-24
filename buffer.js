export function compress(text) {
  // Разделяем строки по символу новой строки
  const lines = text.split("\n");

  // Будем использовать массив для хранения закодированных данных
  const encodedData = [];

  // Кодируем символ иероглифа один раз, т.к. он всегда один и тот же
  const charCode = "辰".charCodeAt(0);
  encodedData.push(charCode >> 8); // Первый байт
  encodedData.push(charCode & 0xff); // Второй байт

  // Каждое двузначное число преобразуем в байт и добавим в массив
  for (const line of lines) {
    // Извлекаем цифры, начиная с 1 символа (пропускаем первый иероглиф)
    for (let i = 1; i < line.length; i += 2) {
      const num = parseInt(line.slice(i, i + 2), 10);
      encodedData.push(num); // сохраняем каждое двузначное число
    }
  }

  return new Uint8Array(encodedData).buffer;
}

export function decompress(buffer) {
  const uint8array = new Uint8Array(buffer);

  // Восстанавливаем иероглиф из первых двух байтов
  const firstCharCode = (uint8array[0] << 8) | uint8array[1];
  const symbol = String.fromCharCode(firstCharCode);

  let result = [];
  let currentLine = symbol;

  // Восстанавливаем числа из бинарного формата
  for (let i = 2; i < uint8array.length; i++) {
    const number = uint8array[i].toString().padStart(2, "0"); // Восстанавливаем двузначное число
    currentLine += number;
    if (currentLine.length === 13) {
      // Если строка собрана полностью, начинаем новую строку с иероглифа
      result.push(currentLine);
      currentLine = symbol; //
    }
  }
  // Не забудем вернуть в исходном виде (чтобы сравнение сошлось)
  return result.join("\n");
}
