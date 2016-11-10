/**
 * Created by Oscar on 2016-10-26.
 */
window.addEventListener('cloudkitloaded', function() {
    CloudKit.configure({
        containers: [{
            containerIdentifier: 'iCloud.com.Frostlight.Frostlight',
            apiToken: 'e929f3df725d09779f16bff52066b7f08c2ff4e90cf41d70cc27e4adfaab52a4',
            environment: 'development'
        }]
    });

    function LocatrViewModel() {
        var self = this;
        var container = CloudKit.getDefaultContainer();
        var publicDB = container.publicCloudDatabase;

        self.locations = ko.observableArray();

        // self.newName = ko.observable(''); //OBS OBS OBS OBS OBS OBS OBS OBS OBS OBS!!!!!!!!!!!!!!!!

        self.fetchRecords = function() {
            var query = { recordType: 'Client' };

            // Execute the query.
            return publicDB.performQuery(query).then(function (response) {
                if(response.hasErrors) {
                    console.error(response.errors[0]);
                    return;
                }
                var records = response.records;
                var numberOfRecords = records.length;
                if (numberOfRecords === 0) {
                    console.error('No matching items');
                    return;
                }

                self.locations(records);
            });

        };

        self.initMap = function (location) {
            var myLatLng = {lat: location.fields.location.value.latitude, lng: location.fields.location.value.longitude};

            var map = new google.maps.Map(document.getElementById('map'), {
                zoom: 4,
                center: myLatLng
            });

            var marker = new google.maps.Marker({
                position: myLatLng,
                map: map,
                title: 'Map'
            });
        }


        container.setUpAuth().then(function(userInfo) {
            self.fetchRecords();  // Records are public
        });

    }

    ko.applyBindings(new LocatrViewModel());

});