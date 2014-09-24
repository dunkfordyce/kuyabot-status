require('date-utils');

module.exports = function(client) {
    client.db(function(db) {
        db.serialize(function() {
            db.run('create table if not exists status (date int, user text, status text)');
        });

        client.on('command:status', function(from, to, args) {
            console.log('status', from, to, args);
            db.run('insert into status values (?, ?, ?)', [new Date(), from, args]);
            client.say_message(to, from, 'saved', {thing: 'status'});
        });

        client.on('command:laststatus', function(from, to, args) {
            args = args.split(/\s+/);

            var for_user,
                q = 'select * from status';

            if( args[1] ) { 
                for_user = args[1];
            }

            db.all('select * from status order by date desc limit 5', function(err, rows) {
                if( err ) throw err;

                var row,
                    i;

                console.log(rows.length, rows);

                for( i=rows.length-1; i>=0; i--) {
                    row = rows[i];
                    row.date = new Date(row.date);
                    client.say(to, row.date.toFormat('YYYY/MM/DD HH:MM') + ' '+ row.user+': '+row.status);
                }
            });
        });
    });
};
