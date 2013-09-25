
module.exports.overlays = {
    name: "php",
    defaultConfig: {
        "httpd": {
            "port": null
        }
    },
    toStandardConfig: function(config) {
        return {
            "io": {
                "port": (config && config.httpd.port) || null
            }
        };
    },
    fromStandardConfig: function(config) {
        return {
            "httpd": {
                "port": config.io.port
            }
        };
    },
    getLaunchScript: function($pinf, config, options) {
        var args = [
            "php",
            "-S", "127.0.0.1:" + config.httpd.port
        ];
        // @see http://php.net/manual/en/features.commandline.webserver.php
        if ($pinf.config.routerScript) {
            args = args.concat([
                $pinf.config.routerScript
            ]);
        } else
        if ($pinf.config.documentRoot) {
            args = args.concat([
                "-t", $pinf.config.documentRoot
            ]);
        } else {
            //$pinf.getAPI("console").configure("Set 'routerScript' or 'documentRoot' in config");
        }
        args = args.concat([
            ">", options.stdoutPath,
            "2>", options.stderrPath
        ]);
        return [
            "#!/bin/sh",
            args.join(" ")
        ].join("\n");
    }
};

require("pinf-io-daemonize/io").forModule(module, module.exports.overlays);
