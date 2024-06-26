import React from 'react';
import { useParams } from 'react-router-dom';
import WorksFilteringPage from '../../../components/WorksFilteringPage';
import { subjectItems } from '../../../config';

type SubjectHeroMappingType = {
    [K in keyof typeof subjectItems]?: {
        title: string;
        description: string;
    }
};

const SubjectByName: React.FC = () => {
    const { name } = useParams<{ name: keyof typeof subjectItems }>();

    const subjectHeroMapping: SubjectHeroMappingType = {
        'Fantasy': {
            'title': 'Завітай у світ <u>фантазії</u> та магії.',
            'description': 'Відчуй силу магії та сміливість героїв, відкривай <u><b>незліченні</b></u> світи, де все можливо. Переглянь наш <u><b>великий</b></u> вибір фентезійних книг, <b>вибери</b> свою та <b>поділися</b> своїми враженнями.'
        },
        'Science Fiction': {
            'title': 'Твій <u>космічний</u> шлях починається тут',
            'description': 'Занурся у світ, де наука та технології відкривають нові горизонти, а майбутнє здається вже теперешнім.'
        },
        'Dystopian': {
            'title': 'Антиутопія: <u>інший</u> світ чекає, але чи чекаєш на нього ти?',
            'description': 'Занурся у світ, де суспільство переживає радикальні зміни та відчуй на собі, яким може бути майбутнє, якщо ми нічого не робити зараз.'
        },
        'Mystery': {
            'title': 'Відчуй себе Шерлоком Голмсом та розплутуй складні <u>детективні</u> справи',
            'description': 'Відкривай для себе <u><b>незліченні</b></u> історії, де кожна загадка веде до нової. Переходь до нашого каталогу, <b>знаходь</b> книгу та <b>оціни</b> її, допомагаючи нашій спільноті.'
        },
        'Horror': {
            'title': '<u>Темрява</u> чекає.',
            'description': 'Відкривай для себе історії, що змусять тебе перевіряти, чи не зачинені двері. Відчуй, як адреналін наповнює твоє тіло.'
        },
        'Romance': {
            'title': 'Кохання в повітрі – <u>відчуй</u> його.',
            'description': 'Відкривай для себе історії, що змусять твоє серце битися швидше. Відчуй, як іскри страсті злітають зі сторінок.'
        },
        'LGBTQ+': {
            'title': '<u>Любов</u> без меж.',
            'description': 'Відкривай для себе історії, що відображають всю красу людської різноманітності. Відчуй, як кожна історія відкриває нові горизонти.'
        },
        'Contemporary Fiction': {
            'title': '<u>Життя</u> тут і зараз.',
            'description': 'Занурся у світ, де сьогодення стає основою для історій. Відчуй, як кожна історія відкриває нові перспективи.'
        },
        'Young Adult': {
            'title': 'Молодість — <u>буйність</u>.',
            'description': 'Поринь у світ, де молодість та енергія ведуть до незабутніх пригод. Відчуй, як кожна історія відкриває нові горизонти.'
        },
        'Children\'s': {
            'title': 'Чарівний світ <u>дитинства</u>.',
            'description': 'Відкривай для себе історії, що відображають світ через очі дитини. Відчуй, як кожна історія відкриває світ чарівності та невинності.'
        },
        'Biography': {
            'title': 'Життя <u>великих</u> людей.',
            'description': 'Відкривай для себе історії, що відображають життя відомих людей. Вчись на чужому досвіді та не повторюй чужих помилок.'
        },
        'Food & Drink': {
            'title': 'Смак <u>життя</u>',
            'description': 'Поринь у світ, де кулінарні шедеври оживають на сторінках. Відчуй, як кожна історія відкриває нові гастрономічні пригоди.'
        },
        'Graphic Novel': {
            'title': '<u>Картинка</u> варта тисячі слів.',
            'description': 'Відкривай для себе історії, що відображають світ через візуальне мистецтво. Відчуй, як кожна історія відкриває нові візуальні перспективи.'
        },
        'Art & Photography': {
            'title': 'Злови <u>мить</u>, навіки захоплену в нерухомому кадрі.',
            'description': 'Відкривай для себе історії, що відображають світ через об’єктив камери. Відчуй, як кожна історія відкриває нові перспективи.'
        },
        'Action & Adventures': {
            'title': 'Пригоди на кожній сторінці — не відвернеш <u>очей</u>.',
            'description': 'Відкривай для себе історії, що відображають світ через пригоди та екшн. Відчуй, як кожна історія відкриває нові перспективи.'
        },
        'Science & Technology': {
            'title': 'Наука та технології — <u>майбутнє</u> вже тут.',
            'description': 'Зрозумій теперішнє – зрозумієш майбутнє. Розберися у роботі сучасних технологій та працях сучасних науковців – відкрий нові горизонти.'
        },
        'History & Travel': {
            'title': '<u>Ехо минулого</u>, чутне донині.',
            'description': 'Відчуй <b>пульс</b> історії, відкрий нові горизонти, де кожен крок є подорожжю в часі.'
        },
        'True Crime': {
            'title': '<u>Тіні</u> правди.',
            'description': 'Відчуй темряву реальних злочинів, де кожна історія є тінню правди, де кожна історія є відбитком моторошної реальності.'
        },
        'Religion & Spirituality': {
            'title': '<u>Відблиск</u> віри.',
            'description': 'Відчуй світло віри та духовності, пізнай <b>себе</b>, відкриваючи нові горизонти зсередини.'
        },
        'Humanities & Social Sciences': {
            'title': '<u>Дзеркало</u> людства.',
            'description': 'Відчуй відбиток людства, де кожна історія є відображенням соціальних наук.'
        },
    }

    return (
        <WorksFilteringPage
            currentPage='subjects'
            defaultSubject={name}
            subjects={false}
            title={name && subjectHeroMapping[name]?.title ? subjectHeroMapping[name]?.title : ''}
            description={name && subjectHeroMapping[name]?.description ? subjectHeroMapping[name]?.description : ''}
            isbn={name ? subjectItems[name] : ''}
        />
    );
};

export default SubjectByName;