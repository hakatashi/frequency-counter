var fs = require('fs');

var reserved = JSON.parse(fs.readFileSync('reserved.json'));

var results = {};

var strips = {
	'C++': [
		/\/\*[\s\S]*?\*\//g,
		/\/\/.*$/mg
	],
	'Java': [
		/\/\*[\s\S]*?\*\//g,
		/\/\/.*$/mg
	],
	'JavaScript': [
		/\/\*[\s\S]*?\*\//g,
		/\/\/.*$/mg
	],
	'C#': [
		/\/\*[\s\S]*?\*\//g,
		/\/\/.*$/mg
	],
	'Objective-C': [
		/\/\*[\s\S]*?\*\//g,
		/\/\/.*$/mg
	],
	'Ruby': [
		/#.*$/mg
	],
	'Python': [
		/#.*$/mg,
		/'''[\s\S]*?'''/g
	],
	'PHP': [
		/\/\*[\s\S]*?\*\//g,
		/\/\/.*$/mg,
		/#.*$/mg
	],
	'Visual Basic': [
		/'.*$/mg
	],
	'Erlang': [
		/%.*$/mg
	]
}

for (var language in reserved) {
	if (reserved.hasOwnProperty(language)) {
		var srcpath = './src/' + language;
		var words = reserved[language];
		var result = {};

		if (fs.existsSync(srcpath)) {
			var sourceFiles = fs.readdirSync(srcpath);

			sourceFiles.forEach(function (sourceFile) {
				var source = fs.readFileSync(srcpath + '/' + sourceFile).toString();

				strips[language].forEach(function (strip) {
					source = source.replace(strip, ' ');
				});

				var tokens = source.split(/[^a-zA-Z_$]/);

				tokens.forEach(function (token) {
					if (token === '') return;

					if (words.indexOf(token) !== -1) {
						if (!result[token]) result[token] = 0;

						result[token]++;
					}
				});
			});
		}

		results[language] = result;

		console.log('\n# ' + language);

		var ranking = [];

		for (var word in result) {
			if (result.hasOwnProperty(word)) {
				ranking.push([word, result[word]]);
			}
		}

		ranking.sort(function (a, b) {
			return b[1] - a[1];
		});

		for (var i = 0; i < 10; i++) {
			console.log(ranking[i][0] + ': ' + ranking[i][1]);
		}
	}
}

fs.writeFile('result.json', JSON.stringify(results));
