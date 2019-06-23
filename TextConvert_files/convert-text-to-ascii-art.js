window.bridges["convert-text-to-ascii-art"] = function() {

    var lib = figlet;
    var preloaded    = null;
    var customFont   = "";

    var bridge = function (text) {
        var tool = this;

        updateFontDescription(tool);

        if (typeof lib === "undefined") {
            tool.output.showNegativeBadge("Can't convert", "ASCII art library is not available.");
            return;
        }

        if (!preloaded) {
            tool.output.showNegativeBadge("Can't convert", "Fonts are being preloaded.");
            preloadFonts(tool);
            return;
        }

        var options = parseOptions(tool);
        var isCustom = tool.options.get().font == "custom";

        if (isCustom && !parseCustomFont(tool)) {
            return;
        }

        figlet(text, options, function(err, text) {
            if (err) {
                tool.output.showError(err);
                return;
            }
            tool.respond(text);
        });
    }

    function parseOptions(tool) {
        var options = tool.options.get();
        return {
            font: options.font == "custom" ? customFont : options.font,
            horizontalLayout: options["h-layout"],
            verticalLayout: options["v-layout"]
        }
    }

    function parseCustomFont(tool) {
        var options = tool.options.get();

        if (options.font == "custom") {

            var url      = options.custom;
            var ext      = ".flf";
            var hash     = CryptoJS.MD5(url).toString();
            var validURL = (url !== ext && url.indexOf(ext) == (url.length - ext.length));

            if (hash == customFont) {
                return true;
            }

            
            tool.input.hideBadge();
            tool.output.hideBadge();

            if (validURL) {
                lib.custom.deleteFont(customFont);
                customFont = "";

                if (lib.custom.loadFont(hash, url, function(response) {

                    tool.input.hideBadge();
                    tool.output.hideBadge();

                    if (!response.loaded) {
                        tool.output.showNegativeBadge("Custom font error", "We couldn't load your custom font.");
                    }
                    else {
                        customFont = hash;
                    }
                    
                    tool.convert();
                }) !== undefined) {

                    customFont = hash;
                    return true;
                    
                }
            }
            else {
                tool.output.showNegativeBadge("Can't convert", "Custom font URL is provided in invalid format.");
            }
        }
    }

    function preloadFonts(tool) {
        if (preloaded === null) {
            
            preloaded = false;
            
            var status = function(text) { tool.input.showStatus(text) };
            var warn   = function(a, b) { tool.input.showWarningBadge(a, b); }
            var error  = function(a, b) { tool.input.showNegativeBadge(a, b); }

            tool.input.hideBadge();
            tool.output.hideBadge();

            warn("Hold up!", "We're preloading some fonts.");

            var fonts = lib.custom.localFonts;
            if (!fonts || fonts.length == 0) {
                error("Can't preload.", "We couldn't find any fonts.");
                preloaded = true;
                return;
            }

            var i = 0;
            var total = fonts.length;

            lib.custom.loadLocalFonts(fonts, function(final) {
                preloaded = true;

                if (!final.loaded) {
                    error("Can't preload.", "Something has gone wrong.");
                }
                else {
                    tool.input.hideBadge();
                    tool.output.hideBadge();
                    tool.convert();
                }
            }, function(partial){
                status("preloaded {0}/{1}".format(++i, total));
            })
        }
    }

    function updateFontDescription(tool) {
        var which = parseOptions(tool).font;
        var text  = "";

        if (!preloaded) {
            text = "We're preloading default fonts.";
        }
        else {
            var data = lib.metadata(which, function(err, options, headerComment) {
                if (err) {
                    text = "There was an error parsing this\nfont. No info available."
                }
                else {
                    text = "This font has no description.";
                    if (headerComment) {
                        text = textTrunc(headerComment, 30, 30*4-1);
                    }
                }
            })
        }

        tool.options.describe("font-info", text);
    }

    function textTrunc(text, n, max) {
        var chunks = [];

        if (text.length > max) {
            text = text.substring(0, max) + "…";
        }

        text = text.replace(/\n/igm, " ");

        for (var i = 0, ln = text.length; i < ln; i += n) {
            chunks.push(text.substring(i, i + n));
        }

        text = chunks.join("\n");
        return text;
    }

    return {
        converter: bridge,
        config: {}
    }

}
