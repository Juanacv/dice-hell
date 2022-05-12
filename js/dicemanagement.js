(function() {
	var $roll = document.getElementById('roll');
	$clean = document.getElementById('clean'),
	$firstColumnDiv = document.getElementById("throws-10"),
	$secondColumnDiv = document.getElementById("throws-20"),
	$totalInput = document.getElementById('total'),
	$diceSelect = document.getElementById('diceType'),
	$totalModificationDiv = document.getElementById('totalModification'),
	$throwContainer = document.getElementById('throwContainer'),
	$diceInput = document.getElementById('diceNumber'),
	$invalidDicesInput = document.getElementById('invalidDices'),
	$explosiveDicesInput = document.getElementById('explosiveDices'),
	$storageCheck = document.getElementById("storage");
	
	const MAXDICES = 256;
	const MAXRAND = 50;
	const MINRAND = 10;
	const MAXSTORAGE = 20;
	function _disableButton() {
		//no me gusta usar variables globales en una funcion, pero...
		$roll.disabled = true;
		$roll.classList.remove("btn-primary");
		$roll.classList.add("btn-secondary");
		//fin				
	}
	function _enableButton() {
		//otra vez modificando variables globales, para un futuro tal vez convertir el código en una clase
		$roll.classList.remove("btn-secondary");
		$roll.classList.add("btn-primary");	
		$roll.disabled = false;
		//fin				
	}
	function _setClass($invalidDicesArr, $explosiveDicesArr, $index) {
		$class = "text-success"; //pinta los dados si son válidos o inválidos
		if ($invalidDicesArr.includes(parseInt($index))) {
			$class = "text-danger";
		}
		if ($explosiveDicesArr.includes(parseInt($index))) {
			$class = "text-warning";
		}	
		return $class;		
	}
	function _showResultGrouped($groupArray, $invalidDicesArr, $storage, $explosiveDicesArr) {
		//muestra el resultado agrupado por valores
		$textGroup = '';
		for (var index in $groupArray) {
			$class = _setClass($invalidDicesArr, $explosiveDicesArr, index);
			$textGroup += '<span class="'+$class+'">'+ $groupArray[index]+':['+index+']'+'</span>'+'-';
		}
		var $throwHTML = '{'+$textGroup.substring(0,$textGroup.length-1)+'}';	
		_storageThrow($throwHTML,$storage);
		//fin					
	}
	function _applyModification($totalInt) {
		$totalModification = parseInt($totalModificationDiv.value);
		if (isNaN($totalModification)) $totalModification = 0;
		return $totalInt + $totalModification;
	}
	function _paintHTML($throwContainer, $singleThrow) {
		$throwContainer.innerHTML = $throwContainer.innerHTML + '<div class="col-md-1 col-sm-1"><div class="card"><h5>'+$singleThrow+'</h5></div></div>';	
	}
	function _groupingArray($groupArray,$singleThrow) {
		//agrupa los resultados en un array
		if (typeof $groupArray[$singleThrow] === 'undefined') {
			$groupArray[$singleThrow] = 1;
		}
		else {
			$groupArray[$singleThrow] = $groupArray[$singleThrow] + 1;
		}	
		return $groupArray;					
	}
	function _showThrow($throw, $invalidDicesArr, $explosiveDicesArr) {
		var $groupArray = [],
		$totalInt = 0;		
		$throwContainer.innerHTML = '';
		
		_disableButton();
		
		for (var i = 0; i < $throw.length; i++) {
			_paintHTML($throwContainer, $throw[i]);
			if (!$invalidDicesArr.includes($throw[i])) {
				$totalInt += $throw[i];	
			}			
			$groupArray = _groupingArray($groupArray,$throw[i]);
		}
		$totalInt = _applyModification($totalInt);	
		$storage = $storageCheck.checked;
		_storageTotal($totalInt, $storage);
		_showResultGrouped($groupArray, $invalidDicesArr, $storage, $explosiveDicesArr);
		_enableButton();		
	}
	//Separa y parse los dados inválidos para la tirada
	function _splitAndParse($dicesArr, $diceType, $invalidDicesArr = []) {
		var $dicesArr = $dicesArr.split(","),
		$filteredDices = [];
		for (var i = 0; i < $dicesArr.length; i++) {
			$dice = parseInt($dicesArr[i]);
			if (!isNaN($dice) && ($dice >= 1 && $dice <= $diceType) && !$invalidDicesArr.includes($dice))  {
				$filteredDices.push($dice);
			}
		}
		return $filteredDices;
	}
	function _randomNumberGenerator($diceType) {
		$multiplier = 0;
		while ($multiplier < MINRAND) {
			$multiplier = Math.round(Math.floor(Date.now() / 1000)) % (Math.floor(Math.random() * MAXRAND) + MINRAND);
		}
		$maxRandomNumber = MAXDICES * $multiplier;
		$randomNumbers = [];
		for (var i = 0; i < $maxRandomNumber; i++) {
			$randomNumbers.push(Math.floor(Math.random() * $diceType) + 1);
		}
		return $randomNumbers;
	}
	function _randomPicker($diceNumber, $randomNumbers) {
		$throw = [];
		$indexes = [];
		while ($throw.length < $diceNumber) {
			$index = Math.floor(Math.random() * ($randomNumbers.length-1));
			if (!$indexes.includes()) {
				if ((Math.floor(Math.random() * MAXRAND) + MINRAND) % 2 === 0) $throw.push($randomNumbers[$index]); //extra random
				$indexes.push($index);
				if ($indexes.length === $randomNumbers.length) $indexes = []; // me aseguro que no es un bucle infinito, reseteo los index
			}
		}
		return $throw;
	
	}
	function rollDices() {		
		var $invalidDices = $invalidDicesInput.value,
		$explosiveDices = $explosiveDicesInput.value,
		$invalidDicesArr = [],
		$explosiveDicesArr = [],
		$throw = [];
		
		var $diceType = parseInt($diceSelect.options[$diceSelect.selectedIndex].value,10);
		
		var $diceNumber = parseInt($diceInput.value,10);

		
		if (!isNaN($diceNumber) && !isNaN($diceType) && ($diceNumber >= 1 && $diceNumber <= MAXDICES)) {	
			$invalidDicesArr = _splitAndParse($invalidDices, $diceType);
			$explosiveDicesArr = _splitAndParse($explosiveDices, $diceType, $invalidDicesArr);
			$throw = _randomPicker($diceNumber,_randomNumberGenerator($diceType));
			_showThrow($throw, $invalidDicesArr, $explosiveDicesArr);
		}
		else {
			alert("Número de dados entre 1 y " + MAXDICES);
		}		
	}
	function _paintTotal($storedTotals) {
		var $totalInt = 0;

		$totalInput.value = $totalInt;
		for (var i = 0; i < $storedTotals.length; i++) {
			$totalInt += $storedTotals[i];
		}
		$totalInput.value = $totalInt;
	}
	function _paintStoredDices($storedDices) {
		clearThrows();
		for (var i = 0; i < $storedDices.length; i++) {
			if (i < 10) $firstColumnDiv.innerHTML += '<p class="throw-storaged">'+$storedDices[i]+'</p>';
			if (i >= 10) $secondColumnDiv.innerHTML += '<p class="throw-storaged">'+$storedDices[i]+'</p>';
		}
	}	
	function _storageTotal($total, $storage = false) {
		var $storedTotals = JSON.parse(localStorage.getItem("storedTotals"));
		if ($storedTotals === null) $storedTotals = [];			
		if ($storedTotals.length === MAXSTORAGE) $storedTotals.shift();
		if ($storage) { 			
			$storedTotals.push($total);		
		}
		else {
			$storedTotals = [$total];
		}
		_paintTotal($storedTotals);	
		if ($storage) localStorage.setItem("storedTotals",JSON.stringify($storedTotals));	
	}
	function _storageThrow($dices, $storage = false) {
		var $storedDices = JSON.parse(localStorage.getItem("storedDices"));
		if ($storedDices === null) $storedDices = [];	
		if ($storedDices.length === MAXSTORAGE) $storedDices.shift();
		if ($storage) { 			
			$storedDices.push($dices);		
		}
		else {
			$storedDices = [$dices];
		}		
		_paintStoredDices($storedDices);
		if ($storage) localStorage.setItem("storedDices",JSON.stringify($storedDices));
	}
	function clearThrows($storedDices) {
		$firstColumnDiv.innerHTML = "";
		$secondColumnDiv.innerHTML = "";
	}
	function cleanStoragedThrows() {
		clearThrows();
		localStorage.clear();
	}
	$roll.addEventListener('click', rollDices);
	$clean.addEventListener('click', cleanStoragedThrows);
})();