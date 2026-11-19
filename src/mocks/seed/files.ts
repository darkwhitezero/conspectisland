import erScheme from '../assets/er-scheme.png';
import evmBus from '../assets/evm-bus.jpg';
import intuition from '../assets/intuition.jpg';
import ioControllers from '../assets/io-controllers.jpg';
import photo1 from '../assets/photo1.jpg';
import photo2 from '../assets/photo2.jpg';
import type { ConspectFile } from '../../types';

/** Файл в мок-БД: метаданные + текст (TXT, MD) или адрес картинки. */
export interface FileRecord extends ConspectFile {
  text?: string;
  url?: string;
}

const encoder = new TextEncoder();

function text(id: string, conspectId: string, position: number, fileName: string, content: string, ocrSourceFileId?: string): FileRecord {
  const mimeType = fileName.endsWith('.md') ? 'text/markdown' : 'text/plain';
  const record: FileRecord = { id, conspectId, position, fileName, mimeType, sizeBytes: encoder.encode(content).length, text: content };
  if (ocrSourceFileId) record.ocrSourceFileId = ocrSourceFileId;
  return record;
}

function image(id: string, conspectId: string, position: number, fileName: string, url: string, sizeBytes: number): FileRecord {
  const mimeType = fileName.endsWith('.png') ? 'image/png' : 'image/jpeg';
  return { id, conspectId, position, fileName, mimeType, sizeBytes, url };
}

export const seedFiles: FileRecord[] = [
  // «Нормальные формы»
  text(
    'f_nf_md',
    'c_nf',
    1,
    'normal-forms.md',
    `# Нормальные формы

Нормализация устраняет избыточность и аномалии вставки, обновления и удаления.

## 1НФ
Все атрибуты **атомарны**, нет повторяющихся групп.

## 2НФ
1НФ + каждый неключевой атрибут полностью зависит от *всего* первичного ключа.

## 3НФ
2НФ + нет транзитивных зависимостей неключевых атрибутов от ключа.

> Проверка: встроенный HTML вроде <b onclick="alert(1)">такого</b> и <script>alert('x')</script> показывается как текст и не выполняется.

- [Википедия: нормальная форма](https://ru.wikipedia.org/wiki/Нормальная_форма)
`,
  ),
  text('f_nf_txt', 'c_nf', 2, 'examples.txt', 'Пример: Заказ(номер, клиент, адрес_клиента)\nадрес_клиента зависит от клиента, а не от номера — нарушение 3НФ.\n'),

  // «Транзакции и уровни изоляции»
  text(
    'f_tx_md',
    'c_tx',
    1,
    'transactions.md',
    `# Транзакции

**ACID**: атомарность, согласованность, изолированность, долговечность.

## Уровни изоляции
1. **READ UNCOMMITTED** — возможны грязное чтение, неповторяемое чтение и фантомы.
2. **READ COMMITTED** — нет грязного чтения.
3. **REPEATABLE READ** — нет неповторяемого чтения.
4. **SERIALIZABLE** — нет и фантомов.
`,
  ),

  // «SQL: соединения таблиц» — пары «фото → распознанный текст»
  image('f_join_p1', 'c_join', 1, 'photo1.jpg', photo1, 193081),
  text('f_join_t1', 'c_join', 2, 'photo1.txt', 'SQL: соединения\nINNER JOIN — только совпадения\nLEFT JOIN — все строки слева\nRIGHT JOIN — все строки справа\nFULL JOIN — объединение\n\nSELECT s.name, g.title\nFROM students s\nJOIN groups g ON g.id = s.group_id\n', 'f_join_p1'),
  image('f_join_p2', 'c_join', 3, 'photo2.jpg', photo2, 190170),
  text('f_join_t2', 'c_join', 4, 'photo2.txt', 'Соединение по условию\nCROSS JOIN = декартово произведение\n|A x B| = |A| * |B|\n\nSelf join: таблица сама с собой\n', 'f_join_p2'),

  // «ER-модели»
  image('f_er_png', 'c_er', 1, 'er-scheme.png', erScheme, 51536),
  text('f_er_md', 'c_er', 2, 'er-notes.md', '# ER-модели\n\n- **Сущность** — объект предметной области.\n- **Связь** — 1:1, 1:N, M:N.\n- M:N реализуется через связующую таблицу.\n\n_Добавлено позже: слабые сущности._\n'),

  // «Индексы»
  text('f_idx_txt', 'c_idx', 1, 'indexes.txt', 'B-дерево — индекс по умолчанию.\nХеш-индекс — только равенство.\nСоставной индекс работает по левому префиксу.\n'),

  // «Модальная логика: система K»
  text('f_modal_md', 'c_modal', 1, 'system-k.md', '# Система K\n\nАксиома K: □(p → q) → (□p → □q)\n\nПравило необходимости: если ⊢ p, то ⊢ □p.\n'),

  // «Интуиционистская логика» — распознавание не удалось
  image('f_intu_jpg', 'c_intu', 1, 'lecture-03.jpg', intuition, 187296),

  // «Системная шина и арбитраж»
  image('f_bus_jpg', 'c_bus', 1, 'bus-lecture.jpg', evmBus, 181056),
  text('f_bus_txt', 'c_bus', 2, 'bus.txt', 'Шины: адреса, данных, управления.\nАрбитраж: централизованный (параллельный, цепочечный) и децентрализованный.\n'),

  // «Контроллеры ввода-вывода»
  image('f_io_jpg', 'c_io', 1, 'io-controllers.jpg', ioControllers, 183992),
  text('f_io_txt', 'c_io', 2, 'io-controllers.txt', 'Контроллеры ввода-вывода\nПрограммный опрос (polling)\nПрерывания: IRQ, вектор\nDMA — прямой доступ к памяти\n', 'f_io_jpg'),

  // Чужой проект
  text('f_law_txt', 'c_law', 1, '149-fz.txt', 'Федеральный закон «Об информации, информационных технологиях и о защите информации».\n'),
];
