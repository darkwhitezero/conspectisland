// HTML-представления, «собранные языковой моделью». Формулы — в MathML,
// браузер рисует их сам. Стили — внутри документа: он показывается
// изолированно в <iframe sandbox>.

const STYLE = `
  body { font-family: Georgia, 'Times New Roman', serif; line-height: 1.6; color: #3a2e2a;
         max-width: 42rem; margin: 0 auto; padding: 1.5rem; background: #fff; }
  h1, h2 { font-family: system-ui, sans-serif; line-height: 1.25; }
  h1 { font-size: 1.6rem; } h2 { font-size: 1.2rem; margin-top: 1.75rem; }
  math { font-size: 1.15em; }
  .formula { margin: 1rem 0; padding: 0.75rem 1rem; background: #f5f1e8; border-radius: 8px; }
  table { border-collapse: collapse; } td, th { border: 1px solid #e7e0d3; padding: 0.25rem 0.6rem; }
`;

export function htmlDocument(title: string, body: string): string {
  return `<!doctype html><html lang="ru"><head><meta charset="utf-8"><title>${title}</title><style>${STYLE}</style></head><body>${body}</body></html>`;
}

const NORMAL_FORMS = htmlDocument(
  'Нормальные формы',
  `<h1>Нормальные формы</h1>
<p>Нормализация устраняет избыточность данных и аномалии вставки, обновления и удаления.</p>
<h2>Функциональная зависимость</h2>
<p>Атрибут <i>Y</i> функционально зависит от <i>X</i>, если каждому значению <i>X</i> соответствует ровно одно значение <i>Y</i>:</p>
<div class="formula"><math display="block"><mi>X</mi><mo>→</mo><mi>Y</mi><mspace width="1em"/><mo>⇔</mo><mspace width="1em"/>
<mo>∀</mo><msub><mi>t</mi><mn>1</mn></msub><mo>,</mo><msub><mi>t</mi><mn>2</mn></msub><mo>:</mo>
<msub><mi>t</mi><mn>1</mn></msub><mo>[</mo><mi>X</mi><mo>]</mo><mo>=</mo><msub><mi>t</mi><mn>2</mn></msub><mo>[</mo><mi>X</mi><mo>]</mo>
<mo>⇒</mo><msub><mi>t</mi><mn>1</mn></msub><mo>[</mo><mi>Y</mi><mo>]</mo><mo>=</mo><msub><mi>t</mi><mn>2</mn></msub><mo>[</mo><mi>Y</mi><mo>]</mo></math></div>
<h2>1НФ, 2НФ, 3НФ</h2>
<ul><li><b>1НФ</b> — все атрибуты атомарны.</li>
<li><b>2НФ</b> — нет частичных зависимостей от составного ключа.</li>
<li><b>3НФ</b> — нет транзитивных зависимостей: из <math><mi>K</mi><mo>→</mo><mi>A</mi></math> и <math><mi>A</mi><mo>→</mo><mi>B</mi></math> не должно следовать <math><mi>K</mi><mo>→</mo><mi>B</mi></math> для неключевого <i>B</i>.</li></ul>
<p>Пример: в таблице <code>Заказ(номер, клиент, адрес_клиента)</code> адрес зависит от клиента, а не от номера заказа — это нарушение 3НФ.</p>`,
);

const ER_OLD = htmlDocument(
  'ER-модели',
  `<h1>ER-модели</h1>
<p><b>Сущность</b> — объект предметной области; <b>связь</b> — отношение между сущностями.</p>
<h2>Кардинальность</h2>
<p>Связи бывают 1:1, 1:N и M:N. Связь M:N реализуется через связующую таблицу, число строк которой не больше</p>
<div class="formula"><math display="block"><mo>|</mo><mi>A</mi><mo>|</mo><mo>·</mo><mo>|</mo><mi>B</mi><mo>|</mo></math></div>
<p>На схеме деканата: студент учится в группе, группа относится к кафедре.</p>`,
);

const MODAL_K = htmlDocument(
  'Модальная логика: система K',
  `<h1>Модальная логика: система K</h1>
<p>Система K — минимальная нормальная модальная логика. К аксиомам классической логики высказываний добавляется аксиома дистрибутивности:</p>
<div class="formula"><math display="block"><mi mathvariant="normal">□</mi><mo>(</mo><mi>p</mi><mo>→</mo><mi>q</mi><mo>)</mo><mo>→</mo><mo>(</mo><mi mathvariant="normal">□</mi><mi>p</mi><mo>→</mo><mi mathvariant="normal">□</mi><mi>q</mi><mo>)</mo></math></div>
<p>и правило необходимости: если <math><mo>⊢</mo><mi>p</mi></math>, то <math><mo>⊢</mo><mi mathvariant="normal">□</mi><mi>p</mi></math>.</p>
<h2>Двойственность операторов</h2>
<div class="formula"><math display="block"><mi mathvariant="normal">◇</mi><mi>p</mi><mo>≡</mo><mo>¬</mo><mi mathvariant="normal">□</mi><mo>¬</mo><mi>p</mi></math></div>
<p>В семантике Крипке <math><mi mathvariant="normal">□</mi><mi>p</mi></math> истинно в мире <i>w</i>, если <i>p</i> истинно во всех мирах, достижимых из <i>w</i>.</p>`,
);

const BUS = htmlDocument(
  'Системная шина и арбитраж',
  `<h1>Системная шина и арбитраж</h1>
<p>Системная шина состоит из шины адреса, шины данных и шины управления. Ширина шины адреса <i>n</i> задаёт адресное пространство:</p>
<div class="formula"><math display="block"><mi>N</mi><mo>=</mo><msup><mn>2</mn><mi>n</mi></msup></math></div>
<h2>Арбитраж</h2>
<p>Централизованный (параллельный или цепочечный опрос) и децентрализованный.</p>`,
);

const LAW = htmlDocument('Федеральный закон № 149-ФЗ', '<h1>Федеральный закон № 149-ФЗ</h1><p>Об информации, информационных технологиях и о защите информации.</p>');

/** Готовые HTML-представления по id конспекта. */
export const seedHtml: Record<string, string> = {
  c_nf: NORMAL_FORMS,
  c_er: ER_OLD,
  c_modal: MODAL_K,
  c_bus: BUS,
  c_law: LAW,
};
