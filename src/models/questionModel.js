const questions = [
    // Nivel 1 - Fácil
    {
        id: 1,
        level: 1,
        description: "Encuentra la palabra que comienza con 'c' y termina en 'sa'.",
        pattern: "^c[a-z].*sa$",
        words: ["casa", "cesa", "cisa", "cosa", "cusa"],
        answer: "casa",
        status: false
    },
    {
        id: 2,
        level: 1,
        description: "Encuentra la palabra que comienza con 'm', termina en vocal y tiene una 'r' antes de la última letra.",
        pattern: "^m[a-z].*r[aeiou]$",
        words: ["mara", "mera", "mira", "mora", "mura"],
        answer: "mira",
        status: false
    },
    {
        id: 3,
        level: 1,
        description: "Identifica la palabra que empieza con 'p', tiene una 't' y termina en vocal.",
        pattern: "^p[a-z].*t[aeiou]$",
        words: ["pata", "peta", "pita", "pota", "puta"],
        answer: "pata",
        status: false
    },
    {
        id: 4,
        level: 1,
        description: "Busca la palabra que inicia con 'b', contiene 'll' y termina en vocal.",
        pattern: "^b[a-z].*ll[aeiou]$",
        words: ["balla", "belle", "belli", "bollo", "bulla"],
        answer: "bella",
        status: false
    },
    {
        id: 5,
        level: 1,
        description: "Encuentra la palabra que empieza con 'f' y termina en 'to'.",
        pattern: "^f[a-z].*to$",
        words: ["foto", "frito", "floto", "finto", "fanto"],
        answer: "foto",
        status: false
    },
    {
        id: 6,
        level: 1,
        description: "Busca la palabra que comienza con 'g' y termina en 'ra'.",
        pattern: "^g[a-z].*ra$",
        words: ["gara", "gira", "gora", "gura", "gera"],
        answer: "gara",
        status: false
    },
    {
        id: 7,
        level: 1,
        description: "Encuentra la palabra que comienza con 'l' y termina en 'do'.",
        pattern: "^l[a-z].*do$",
        words: ["lado", "lindo", "luido", "lardo", "lodo"],
        answer: "lado",
        status: false
    },
    {
        id: 8,
        level: 1,
        description: "Identifica la palabra que empieza con 'r', contiene 'b' y termina en vocal.",
        pattern: "^r[a-z]*b[aeiou]$",
        words: ["rabe", "robe", "rube", "rebo", "rabo"],
        answer: "rabo",
        status: false
    },
    {
        id: 9,
        level: 1,
        description: "Busca la palabra que inicia con 'n' y termina en 'ta'.",
        pattern: "^n[a-z].*ta$",
        words: ["nata", "neta", "nita", "nota", "nuta"],
        answer: "nata",
        status: false
    },
    {
        id: 10,
        level: 1,
        description: "Encuentra la palabra que empieza con 's' y termina en 'ra'.",
        pattern: "^s[a-z].*ra$",
        words: ["sara", "sira", "sura", "sera", "sora"],
        answer: "sara",
        status: false
    },

    // Nivel 2 - Intermedio
    {
        id: 11,
        level: 2,
        description: "Encuentra la palabra que comienza con 't' y termina en 'lo'.",
        pattern: "^t[a-z].*lo$",
        words: ["talo", "tilo", "telo", "tulo", "tolo"],
        answer: "talo",
        status: false
    },
    {
        id: 12,
        level: 2,
        description: "Busca la palabra que empieza con 'v' y termina en 'do'.",
        pattern: "^v[a-z].*do$",
        words: ["vado", "vindo", "veldo", "vordo", "vundo"],
        answer: "vado",
        status: false
    },
    {
        id: 13,
        level: 2,
        description: "Identifica la palabra que empieza con 'd' y termina en 'ma'.",
        pattern: "^d[a-z].*ma$",
        words: ["dama", "doma", "dima", "duma", "deima"],
        answer: "dama",
        status: false
    },
    {
        id: 14,
        level: 2,
        description: "Busca la palabra que comienza con 'p' y termina en 'ro'.",
        pattern: "^p[a-z].*ro$",
        words: ["paro", "piro", "puro", "poro", "pavo"],
        answer: "paro",
        status: false
    },
    {
        id: 15,
        level: 2,
        description: "Encuentra la palabra que inicia con 'f' y termina en 'ra'.",
        pattern: "^f[a-z].*ra$",
        words: ["fara", "fera", "fira", "fora", "fura"],
        answer: "fara",
        status: false
    },
    {
        id: 16,
        level: 2,
        description: "Busca la palabra que empieza con 'g' y termina en 'le'.",
        pattern: "^g[a-z].*le$",
        words: ["gale", "gile", "gule", "gole", "gele"],
        answer: "gale",
        status: false
    },
    {
        id: 17,
        level: 2,
        description: "Identifica la palabra que comienza con 'l' y termina en 'ca'.",
        pattern: "^l[a-z].*ca$",
        words: ["laca", "leca", "lica", "loca", "luca"],
        answer: "laca",
        status: false
    },
    {
        id: 18,
        level: 2,
        description: "Busca la palabra que inicia con 'r' y termina en 'ra'.",
        pattern: "^r[a-z].*ra$",
        words: ["rara", "rira", "rora", "rura", "rera"],
        answer: "rara",
        status: false
    },
    {
        id: 19,
        level: 2,
        description: "Encuentra la palabra que comienza con 'n' y termina en 'le'.",
        pattern: "^n[a-z].*le$",
        words: ["nale", "nile", "nole", "nule", "nele"],
        answer: "nale",
        status: false
    },
    {
        id: 20,
        level: 2,
        description: "Busca la palabra que inicia con 's' y termina en 'co'.",
        pattern: "^s[a-z].*co$",
        words: ["saco", "seco", "sico", "soco", "suco"],
        answer: "saco",
        status: false
    },

    // Nivel 3 - Difícil
    {
        id: 21,
        level: 3,
        description: "Identifica la palabra que empieza con 'z' y termina en 'to'.",
        pattern: "^z[a-z].*to$",
        words: ["zato", "zeto", "zito", "zoto", "zuto"],
        answer: "zato",
        status: false
    },
    {
        id: 22,
        level: 3,
        description: "Encuentra la palabra que comienza con 'x' y termina en 'ra'.",
        pattern: "^x[a-z].*ra$",
        words: ["xara", "xera", "xira", "xora", "xura"],
        answer: "xara",
        status: false
    },
    {
        id: 23,
        level: 3,
        description: "Busca la palabra que empieza con 'q' y termina en 'le'.",
        pattern: "^q[a-z].*le$",
        words: ["qale", "qile", "qule", "qole", "qele"],
        answer: "qale",
        status: false
    },

];

export const getQuestionsByLevel = (level) => {
    return questions.filter(q => q.level === parseInt(level));
};
