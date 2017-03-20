angular.module('evtviewer.dataHandler')

.service('evtSourcesApparatus', function(parsedData, evtParser, config, evtSourcesParser, evtCriticalApparatusParser) {
    var apparatus = {};

    apparatus.getContent = function(quote, scopeWit) {
        // console.log('getContent', quote);
        var appContent = {
            attributes : {
                values: quote.attributes || {},
                _keys: Object.keys(quote.attributes) || []
            },
            sources : [], //Elenco delle fonti, ognuna con tutte le info necessarie
            text: '', //Testo della fonte, tab apposito
            quote: '', //Intestazione
            _sourceXml: [],
            _xmlSource: quote._xmlSource.replace(/ xmlns="http:\/\/www\.tei-c\.org\/ns\/1\.0"/g, '') //Xml della citazione, cui si aggiungerà anche l'xml della source selezionata

        }
        
        var sourceId = quote._indexes.sourceId || [];
        var sourceRefId = quote._indexes.sourceRefId || [];
        for (var i = 0; i < sourceId.length; i++) {
            var source = parsedData.getSource(sourceId[i]);
            var entry = apparatus.getSource(source);
            appContent[source.id] = entry;
            appContent._sourceXml[source.id] = entry._xmlSource;
            appContent._sourceXml.length++;
        }
        for (var j = 0;  j < sourceRefId.length; j++) {
            var source = parsedData.getSource(sourceRefId[j]);
            var entry = apparatus.getSource(source);
            appContent.sources[source.id] = entry;
            appContent.sources.length++;
            appContent._sourceXml[source.id] = entry._xmlSource;
            appContent._sourceXml.length++;
        }

        appContent.quote = apparatus.getQuote(quote, scopeWit);
        //console.log('Hey there!',  appContent.quote);

        //appContent.quote = 'collegamento riuscito';

        return appContent;
    };

    apparatus.getSource = function(entry) {
        var source = {
            id: entry.id,
            author: '',
            title: '',
            _xmlSource: entry._xmlSource.replace(/ xmlns="http:\/\/www\.tei-c\.org\/ns\/1\.0"/g, ''),
            text: '',
            bibl: '',
            url: entry.url
        }

        //Transform the bibliographic reference into strings
        var bibref = entry.bibl;
        for (var i = 0; i < bibref.length; i++) {
            source.bibl += apparatus.getText(bibref[i]);
        }
        
        //Tranform the names of the authors into strings
        var author = entry.author;
        for (var i = 0; i < author.length; i++) {
            source.author += apparatus.getText(author[i]);
        }

        //Get the text cited
        source.text = apparatus.getText(entry.quote);

        return source;
    };

    apparatus.getQuote = function (quote, scopeWit) {
        var content = quote.content || [];
        var result = '';
        for (var i in content) {
            if (typeof content[i] === 'string') {
                result += '<span class="textNode">'+content[i]+'</span>';
            } else {
                var skip = ['EVT-POPOVER', 'lb', 'ptr', 'link', 'linkGrp', 'pb'];
                if (skip.indexOf(content[i].tagName) >= 0) {
                    result += '';
                } else if (content[i].type === 'app') {
                    result += apparatus.getAppText(content[i], scopeWit);
                } //else if...analogue --> AnaloguesApparatus.getQuote(analogue).
                else if (content[i].type === 'quote') {
                    result += '<span class="sub_quote"> (('+apparatus.getQuote(content[i], scopeWit)+')) </span>';
                } else if (content[i].content !== undefined) {
                    result += apparatus.getText(content[i]);
                } else {
                    result += apparatus.getQuote(content[i]);
                }
            }
        }
        return result;
    }

    //Eventualmente aggiungere parametro stringa per il valore della class di span (tipo 'author' o 'textNode')
    apparatus.getText = function(entry) {
        var result = '';
        var content = entry.content;
        for (var i in content){
            if (typeof content[i] === 'string') {
                result += '<span class="textNode">'+content[i]+'</span>';
            } else if (content[i].content !== undefined) {
                result += apparatus.getText(content[i]);
            }
        }
        return result;
    }

     apparatus.getAppText = function(entry, scopeWit){
            var result = '';
            if (scopeWit === ''
                || scopeWit === undefined
                || entry._indexes.witMap[scopeWit] === undefined) {
                    var lem = entry.lemma;
                    result += apparatus.getText(entry.content[lem]);
                } else {
                    var rdg = entry._indexes.witMap[scopeWit];
                    result += apparatus.getText(entry.content[rdg]);
                }
            return result;
        }

    return apparatus;
});