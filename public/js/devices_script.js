$(document).ready(function() {
    let socket = io();

    // Toggle device status
    $('.toggle-btn').on('click', function() {
        let device = $(this).data('device');
        let currentStatus = $(this).data('status');
        let newStatus = currentStatus === 'off' ? 'on' : 'off';
        $(this).text(newStatus === 'on' ? 'Turn Off' : 'Turn On').data('status', newStatus);

        // Send device status to the server
        $.ajax({
            url: '/toggle',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ device: device, status: newStatus === 'on' }),
            success: function(response) {

              //Emit socket notification
              socket.emit('deviceAction', { device: device, status: response.status });
            }
        });
    });

    socket.on('newNotification', (res) => {
        showPopup(res)
    });

    // Schedule device
    $('.schedule-btn').on('click', function() {
        let device = $(this).data('device');
        let onTime = $(`#${device}_on_time`).val();
        let offTime = $(`#${device}_off_time`).val();

        // Send schedule to the server
        $.ajax({
            url: '/schedule',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ device: device, onTime: onTime, offTime: offTime }),
            success: function(response) {
                

                $(`#${device}_on_time`).val('');
                $(`#${device}_off_time`).val('');

            }
        });
    });



    $('.get-schedule-btn').on('click', function() {
        $.ajax({
            url: '/status',
            method: 'GET',
            success: function(response) {
                console.log(response.status);  
                console.log(response.schedules);  

                const status = response.status;
                const schedules = response.schedules;


                $('#device-status-table').empty();


                for (const device in status) {
                    const deviceStatus = status[device] ? 'On' : 'Off';
                    const schedule = schedules[device] || { onTime: 'N/A', offTime: 'N/A' };

                    const tableRow = `
                        <tr>
                            <td>${device.charAt(0).toUpperCase() + device.slice(1)}</td>
                            <td>${deviceStatus}</td>
                            <td>${schedule.onTime || 'N/A'}</td>
                            <td>${schedule.offTime || 'N/A'}</td>
                        </tr>
                    `;
                    $('#device-status-table').append(tableRow);
                }
            }
        });
        
    });

    function showPopup(res) {
        const popup = $('#popupNotification');
        $('#popupMessage').text(res.message + " on " + res.time);

        popup.addClass('show');

        setTimeout(function () {
            popup.removeClass('show');
        }, 3000);
    }


});
