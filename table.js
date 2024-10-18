export function compress(text) {
  // Разделяем строки по символу
  const lines = text.split("\n");

  // массив для хранения закодированных данных
  const encodedData = [];

  // Кодируем символ иероглиф один раз, т.к. он всегда одинаковый
  const charCode = "辰".charCodeAt(0);
  encodedData.push(charCode >> 8); // Первый байт
  encodedData.push(charCode & 0xff); // Второй байт

  for (const line of lines) {
    // Извлекаем цифры, начиная с 1 символа (пропускаем первый иероглиф)
    for (let i = 1; i < line.length; i += 2) {
      const num = parseInt(line.slice(i, i + 2), 10);
      encodedData.push(num); // Просто сохраняем каждое двузначное число
    }
  }

  // Преобразуем массив закодированных данных в ArrayBuffer (нужно по условию)
  return new Uint8Array(encodedData).buffer;
}

export function decompress(buffer) {
  const uint8array = new Uint8Array(buffer);

  // Восстанавливаем символ иероглиф из первых 2 байтов
  const firstCharCode = (uint8array[0] << 8) | uint8array[1];
  const symbol = String.fromCharCode(firstCharCode);

  let result = [];
  let currentLine = symbol;

  // Восстанавливаем числа из бинарного формата
  for (let i = 2; i < uint8array.length; i++) {
    const number = uint8array[i].toString().padStart(2, "0"); // Восстанавливаем двузначное число
    currentLine += number;
    if (currentLine.length === 13) {
      // Если строка собрана полностью
      result.push(currentLine);
      currentLine = symbol; // Начинаем новую строку с иероглифа
    }
  }

  return result.join("\n"); // Объединяем строки в исходный вид
}
