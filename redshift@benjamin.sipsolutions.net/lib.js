/* -*- mode: js2; js2-basic-offset: 4; indent-tabs-mode: nil -*- */
/**
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 2 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
**/

const Gio = imports.gi.Gio;
const GLib = imports.gi.GLib;
const Gettext = imports.gettext;

const SHOW_INDICATOR_KEY = 'show-indicator';
const STATE_KEY = 'state';
const NIGHT_TEMP_KEY = 'night-color-temperature';
const DAY_TEMP_KEY = 'day-color-temperature';
const NIGHT_BRT_KEY = 'night-brightness'
const DAY_BRT_KEY = 'day-brightness'
const NIGHT_DAY_KEY = 'night-day';
const DUSK_DAWN_LENGTH_KEY = 'dusk-dawn-length';

const TIME_SOURCE_KEY = 'time-source';

const SUNRISE_TIME_KEY = 'sunrise-time';
const SUNSET_TIME_KEY = 'sunset-time';

const STATE_DISABLED = 0;
const STATE_NORMAL = 1;
const STATE_FORCE = 2;

const TIME_SOURCE_GEOCLUE = 0;
const TIME_SOURCE_LAST_KNOWN = 1;
const TIME_SOURCE_FIXED = 2;



function getSettings(extension) {
    let schemaName = 'org.gnome.shell.extensions.redshift-gnome';
    let schemaDir = extension.dir.get_child('schemas').get_path();
    print(schemaName);
    print(schemaDir);

    // Extension installed in .local
    if (GLib.file_test(schemaDir + '/gschemas.compiled', GLib.FileTest.EXISTS)) {
        let schemaSource = Gio.SettingsSchemaSource.new_from_directory(schemaDir,
                                  Gio.SettingsSchemaSource.get_default(),
                                  false);
        let schema = schemaSource.lookup(schemaName, false);
        print('local install' + schema.toString());

        return new Gio.Settings({ settings_schema: schema });
    }
    // Extension installed system-wide
    else {
        if (Gio.Settings.list_schemas().indexOf(schemaName) == -1)
            throw "Schema \"%s\" not found.".format(schemaName);
        return new Gio.Settings({ schema: schemaName });
    }
}

function initTranslations(extension) {
    let localeDir = extension.dir.get_child('locale').get_path();

    // Extension installed in .local
    if (GLib.file_test(localeDir, GLib.FileTest.EXISTS)) {
        Gettext.bindtextdomain('gnome-shell-extension-redshift', localeDir);
    }
    // Extension installed system-wide
    else {
        Gettext.bindtextdomain('gnome-shell-extension-redshift', extension.metadata.locale);
    }
}
