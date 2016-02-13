'use strict';

/**
 * @ngdoc function
 * @name muzloTemplateApp.controller:PlayerCtrl
 * @description
 * # MainCtrl
 * Controller of the muzloTemplateApp
 */
angular.module('muzloTemplateApp')
  .factory('AudioService', function () {
    "use strict";

    var params = {
      swf_path: 'bower_components/audio5/swf/audio5js.swf',
      throw_errors: true,
      format_time: true
    };

    var audio5js = new Audio5js(params);

    return audio5js;
  })
  .factory('AudioServiceAd', function () {
    "use strict";

    var params = {
      swf_path: 'bower_components/audio5/swf/audio5js.swf',
      throw_errors: true,
      format_time: true
    };

    var audio5js = new Audio5js(params);

    return audio5js;
  })
  .controller('PlayerCtrl', function ($scope, $http, AudioService, AudioServiceAd) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $http.get('/music/Шаблон 1/playlist.json')
      .then(function(response){

        // Сервис для работы с аудио рекламой
        $scope.playerAd = AudioServiceAd;

        // Сервис для работы с аудио
        $scope.player = AudioService;

        $scope.timeoutAd = 0; // Счетчик рекламы

        $http.get('/music/advert.json')
          .then(function(response){

             $scope.ad = response.data[0].files;

             $scope.numberTrackAd = 0;
             $scope.adInterval = response.data[0].rhythm * 15 * 1000;
             $scope.timeoutAd = $scope.adInterval;

          }
        );

        // Шаблон
        $scope.pattern = response.data[0];

        // Плейлисты
        $scope.patterns_dirs = $scope.pattern.patterns_dirs;

        // Текущий плейлист
        $scope.patterns_dir = $scope.patterns_dirs[0];
        // Текущий трек
        $scope.numberTrack = 0;

        // Определение мобильного устройства
        var isMobile = {
          Android: function () {
            return navigator.userAgent.match(/Android/i);
          },
          BlackBerry: function () {
            return navigator.userAgent.match(/BlackBerry/i);
          },
          iOS: function () {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
          },
          Opera: function () {
            return navigator.userAgent.match(/Opera Mini/i);
          },
          Windows: function () {
            return navigator.userAgent.match(/IEMobile/i);
          },
          any: function () {
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
          }
        };

        // Проверка вхождения плейлиста во временной диапазон
        $scope.checkPlaylistTime = function (playlist) {

          return false;
        };

        // Поиск плейлиста по текущему времени
        $scope.findPlaylistTime = function () {

          return false;
        };

        // Сброс
        $scope.reset = function () {
          var time_start = new Date($scope.patterns_dir.time_start*1000),
            time_end = new Date($scope.patterns_dir.time_end*1000),
            ready = false;

          time_start = time_start.getHours() + ":" + time_start.getMinutes();
          time_end = time_end.getHours() + ":" + time_end.getMinutes();

          $('.debug')
            .empty()
            .append("Debug: <br/><br/>" +
            "Название шаблона: " + $scope.pattern.title + "<br/>" +
            "Название плейлиста: " + $scope.patterns_dir.title + "<br/>" +
            "Время начала: " + time_start + "<br/>" +
            "Время окончания: " + time_end + "<br/>" +
            "Текущее время: " + moment().format("HH:mm") + "<br/>");

          // Сброс счетчика рекламы
          $scope.timeoutAd = $scope.adInterval;

          if($scope.isReady()) {
            ready = true;
          } else if ($scope.searchPlaylist()) {
            ready = true;
          }

          if(ready) {
            $scope.numberTrack = 0;
            $scope.shuffle();

            $scope.timeoutAd = $scope.adInterval;

            loadMusic($scope.patterns_dir);
          } else {

            $('.debug')
              .empty()
              .append("Debug: <br/><br/>" +
              "Под текущее время нет шаблона");

            $scope.resetAnimation();
          }
        };

        // Стоп
        $scope.stop = function () {
          $scope.player.audio.pause();
        };

        // Загрузка трека
        var loadMusic = function (pl) {

          $scope.player.load(pl.music_files[$scope.numberTrack].file_name);
          $scope.player.audio.play();

          $scope.player.on('canplay', function() {
            $scope.resetAnimation();
          });

          // Debug
          $scope.debug = function (position, duration) {
            var time_start = new Date($scope.patterns_dir.time_start*1000),
                time_end = new Date($scope.patterns_dir.time_end*1000);

            time_start = time_start.getHours() + ":" + time_start.getMinutes();
            time_end = time_end.getHours() + ":" + time_end.getMinutes();

            $('.debug')
              .empty()
              .append("Debug: <br/><br/>" +
                      "Название шаблона: " + $scope.pattern.title + "<br/>" +
                      "Название плейлиста: " + $scope.patterns_dir.title + "<br/>" +
                      "Время начала: " + time_start + "<br/>" +
                      "Время окончания: " + time_end + "<br/>" +
                      "Название трека: " + $scope.patterns_dir.music_files[$scope.numberTrack].title + "<br/>" +
                      "Исполнитель: " + $scope.patterns_dir.music_files[$scope.numberTrack].owner + "<br/>" +
                      "Жанр: " + $scope.patterns_dir.music_files[$scope.numberTrack].genre + "<br/>" +
                      "Путь к файлу: " + $scope.patterns_dir.music_files[$scope.numberTrack].file_name + "<br/>" +
                      "Продолжительность: " + moment.duration(duration, "seconds").format("mm:ss") + "<br/>" +
                      "Время: " + position);
          };
        };

        // Обновление времени проигрывания трека
        $scope.player.on('timeupdate', function (position, duration) {
          if(!$scope.isReady()) {
            $scope.player.audio.pause();
            $scope.reset();
          }
          $scope.debug(position, duration);

          console.log($scope.timeoutAd);

          $scope.timeoutAd -= 250;

          if($scope.timeoutAd <= 0) {
            $scope.stop();

            $('.ad').show();
            $('.player-buttons').hide();

            $scope.playerAd.load($scope.ad[$scope.numberTrackAd].file_name);
            $scope.playerAd.audio.play();

            // Окончание проигрывания рекламного трека
            $scope.playerAd.on('ended', function () {
              $scope.numberTrackAd++;

              // Если треки в рекламном плейлисте закончились начинаем играть с первого
              if ($scope.numberTrackAd >= $scope.ad.length) {
                $scope.numberTrackAd = 0;
              }

              $scope.timeoutAd = $scope.adInterval;

              setTimeout(function () {
                $scope.play();

                $('.ad').hide();
                $('.player-buttons').show();
              }, 1000);
            });
          }
        });

        // Окончание проигрывания трека и переключение на следующий трек
        $scope.player.on('ended', function () {
          setTimeout(function () {
            $scope.playNext();
          }, 1000);
        });

        // Следующий трек в плейлисте
        $scope.playNext = function () {
          $scope.numberTrack++;

          // Если треки в плейлисте закончились начинаем играть с первого
          if ($scope.numberTrack >= $scope.patterns_dir.music_files.length) {
            $scope.numberTrack = 0;
          }

          loadMusic($scope.patterns_dir);
        };

        // Перемешивание треков в плейлисте
        $scope.shuffle = function () {
          var shuffleArray = function(array) {
            var m = array.length, t, i;

            // While there remain elements to shuffle
            while (m) {
              // Pick a remaining element…
              i = Math.floor(Math.random() * m--);

              // And swap it with the current element.
              t = array[m];
              array[m] = array[i];
              array[i] = t;
            }

            return array;
          }

          $scope.patterns_dir.music_files = shuffleArray($scope.patterns_dir.music_files);
        };

        // Метод проверки попадания во временной интервал
        $scope.checkTimeInterval = function(time_start, time_end) {

          if(time_end > time_start) {
            if((moment(time_start*1000).format("HH:mm:ss") <= moment().format("HH:mm:ss")) &&
              (moment(time_end*1000).format("HH:mm:ss") >= moment().format("HH:mm:ss"))) {
              return true;
            }
          } else {
            if((moment(time_start*1000).format("HH:mm:ss") <= moment().format("HH:mm:ss")) ||
              (moment(time_end*1000).format("HH:mm:ss") >= moment().format("HH:mm:ss"))) {
              return true;
            }
          }

          return false;

        };

        // Метод который проверяет подходит ли плейлист к текущему времени
        $scope.isReady = function() {

          if($scope.checkTimeInterval($scope.patterns_dir.time_start, $scope.patterns_dir.time_end)) {
            return true;
          }

          return false;
        };

        // Метод который ищет подходящий шаблон к текущему времени
        $scope.searchPlaylist = function() {
          var toReturn = false;

          $.each($scope.patterns_dirs, function(i, pattern_dir){
            if($scope.checkTimeInterval(pattern_dir.time_start, pattern_dir.time_end)) {
              $scope.patterns_dir = pattern_dir;
              toReturn = true;
              return true;
            }
          });

          return toReturn;
        };

        // Плей
        $scope.play = function () {
          // Если плеер на паузе
          if($scope.player.position && !$scope.player.playing && $scope.isReady()) {
            $scope.player.audio.play();
            setTimeout(function(){
              $scope.resetAnimation();
            }, 1000);
          }
          // Если включается первый раз
          else if(!$scope.player.position) {
            $scope.reset();
          }

        };

        // Анимация
        $scope.resetAnimation = function() {
          setTimeout(function(){
            $('.player-buttons .bg').removeClass('animated');
          }, 1000);
        };
        $('.player-buttons li.btn-play').click(function(){
          $(this).find('span.bg').addClass('bounce animated forever');
        });

        //if (!isMobile.iOS()) {
        //  $scope.playMusic($scope.currentPlaylist);
        //}
      });
  });
