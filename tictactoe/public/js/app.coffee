$ ->
  Tic =
    data:
      turns: 0
      x: {}
      o: {}
      gameOver: false

    initialize: ->
      @data.gameOver = false
      @.setPlayerNames()
      @.retrieveStats()
      @.assignRoles()
      @.prepareBoard()
      @.updateNotifications()
      @.addListeners()

    setPlayerNames: ->
      @data.player1 = $("input[name='pl-1']").val()
      @data.player2 = $("input[name='pl-2']").val()

    retrieveStats: ->
      @data.p1stats = localStorage[@data.player1] || wins: 0, losses: 0
      if typeof @data.p1stats is "string" then @data.p1stats = JSON.parse @data.p1stats

      @data.p2stats = localStorage[@data.player2] || wins: 0, losses: 0
      if typeof @data.p2stats is "string" then @data.p2stats = JSON.parse @data.p2stats

    getPlayerName: (symbol) ->
      name = if @data.rolep1 == symbol then @data.player1 else @data.player2
      return name

    prepareBoard: ->
      $("form").hide()
      $("#board").empty()
      $(".alerts").removeClass("welcome").show()
      $(".alerts").text("#{@.getPlayerName("X")} Goes first")
      $("<div>", {class: "square"}).appendTo("#board") for square in [0..8]

    assignRoles: ->
      roles = ["X", "O"].sort( ->
        return 0.5 - Math.random()
      )
      @data.rolep1 = roles[0]
      @data.rolep2 = roles[1]

    updateNotifications: ->
      $(".notifications").empty().show()
      @.addNotification "#{@data.player1} is playing #{@data.rolep1}"
      @.addNotification "#{@data.player2} is playing #{@data.rolep2}"
      @.addNotification "#{@data.player1} has #{@data.p1stats.wins} wins and #{@data.p1stats.loses} loses"
      @.addNotification "#{@data.player2} has #{@data.p2stats.wins} wins and #{@data.p2stats.loses} loses"

    addNotification: (msg) ->
      $(".notifications").append($("<p>", {text: msg}))

    addListeners: ->
      $(".square").click ->
        if Tic.data.gameOver is no and not $(@).text().length
          if Tic.data.turns % 2 is 0 then $(@).html("X").addClass("x moved")
          else if Tic.data.turns % 2 isnt 0 then $(@).html("O").addClass("o moved")
          Tic.data.turns++
          Tic.checkEnd()
          if Tic.data.gameOver isnt yes and (".moved").length >= 9 then Tic.addToScore("none")

    checkEnd: ->
      @.data.x = {}
      @.data.o = {}

      # diagoanl check
      diagoanls = [[0, 4, 8], [2, 4, 6]]
      for diagoanl in diagoanls
        for col in diagoanl
          @.checkField(col, 'diagoanl')
        @.checkWin()
        @.emptyStorageVar('diagoanl')

      for row in [0..2]
        start   = row * 3
        end     = (row * 3) + 2
        middle  = (row * 3) + 1

        # vertical check
        @.checkField(start, 'start')
        @.checkField(middle, 'middle')
        @.checkField(end, 'end')
        @.checkWin()

        # Horizontal check
        for column in [start..end]
          @.checkField(column, 'horizontal')
        @.checkWin()
        @.emptyStorageVar('horizontal')

    checkField: (field, storageVar) ->
      if $(".square").eq(field).hasClass("x")
        if @.data.x[storageVar]? then @.data.x[storageVar]++ else @.data.x[storageVar] = 1
      else if $(".square").eq(field).hasClass("o")
        if @.data.o[storageVar]? then @.data.o[storageVar]++ else @.data.o[storageVar] = 1

    checkWin: ->
      for key, value of @.data.x
        if value >= 3
          localStorage.x++
          @.showAlert "#{@.getPlayerName("X")} wins"
          @.data.gameOver = true
          @.addToScore("X")

      for key, value of @.data.o
        if value >= 3
          localStorage.o++
          @.showAlert "#{@.getPlayerName("O")} wins"
          @.data.gameOver = true
          @.addToScore("O")

    addToScore: (winningParty) ->
      @data.turns = 0
      @data.x = {}
      @data.o = {}
      @data.gameOver = yes
      if winningParty is "none"
        @.showAlert "The game was a tie"
      else
        if @data.rolep1 == winningParty then ++@data.p1stats.wins else ++@data.p1stats.loses
        if @data.rolep2 == winningParty then ++@data.p2stats.wins else ++@data.p2stats.loses
        localStorage[@data.player1] = JSON.stringify @data.p1stats
        localStorage[@data.player2] = JSON.stringify @data.p2stats
      @.updateNotifications()
      $(".notifications").append "<a class='play-again'>Play Again?</a>"

    emptyStorageVar: (storageVar) ->
      @.data.x[storageVar] = null
      @.data.o[storageVar] = null

    showAlert: (msg) ->
      $(".alerts").text(msg).slideDown()

  $("form").on "submit", (evt) ->
    evt.preventDefault()

    $inputs = $("input[type='text']")

    namesNotEntered = $inputs.filter( ->
      return @.value.trim() isnt ""
    ).length isnt 2

    namesIdentical = $inputs[0].value is $inputs[1].value

    if namesNotEntered then Tic.showAlert("Player cannot be empty")
    else if namesIdentical then Tic.showAlert("Player names cannot be identical")
    else Tic.initialize()

  $("body").on("click", ".play-again", -> Tic.initialize())
