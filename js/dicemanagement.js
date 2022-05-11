(function() {
	var $roll = document.getElementById('roll');
	var $clean = document.getElementById('clean');
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
	function _showResultGrouped($groupArray, $invalidDicesArr, $storage) {
		//muestra el resultado agrupado por valores
		$textGroup = '';
		for (var index in $groupArray) {
			$class = "text-success"; //pinta los dados si son válidos o inválidos
			if ($invalidDicesArr.includes(parseInt(index))) {
				$class = "text-danger";
			}
			$textGroup += '<span class="'+$class+'">'+ $groupArray[index]+':['+index+']'+'</span>'+'-';
		}
		var $throwHTML = '{'+$textGroup.substring(0,$textGroup.length-1)+'}';	
		_storageThrow($throwHTML,$storage);
		//fin					
	}
	function _applyModification($totalInt) {
		$totalModification = parseInt(document.getElementById('totalModification').value);
		if (isNaN($totalModification)) $totalModification = 0;
		return $totalInt + $totalModification;
	}
	function _paintHTML($throwContainer, $singleThrow) {
		$throwContainer.innerHTML = $throwContainer.innerHTML + '<div class="col-md-1"><div class="card"><h5>'+$singleThrow+'</h5></div></div>';	
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
	function _showThrow($throw, $invalidDicesArr) {
		var $throwContainer = document.getElementById('throwContainer'),
		$groupArray = [],
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
		$storage = document.getElementById("storage").checked;
		_storageTotal($totalInt, $storage);
		_showResultGrouped($groupArray, $invalidDicesArr, $storage);
		_enableButton();		
	}
	//Separa y parse los dados inválidos para la tirada
	function _splitAndParse($invalidDices, $diceType) {
		var $invalidDicesArr = $invalidDices.split(","),
		$filteredDices = [];
		for (var i = 0; i < $invalidDicesArr.length; i++) {
			$invalidDice = parseInt($invalidDicesArr[i]);
			if (!isNaN($invalidDice) && $invalidDice >= 1 && $invalidDice <= $diceType) {
				$filteredDices.push($invalidDice);
			}
		}
		return $filteredDices;
	}
	function rollDices() {
		var $diceSelect = document.getElementById('diceType'),
		$diceInput = document.getElementById('diceNumber'),
		$invalidDices = document.getElementById('invalidDices').value,
		$invalidDicesArr = [],
		$throw = [];
		
		var $diceType = parseInt($diceSelect.options[$diceSelect.selectedIndex].value,10);
		
		var $diceNumber = parseInt($diceInput.value,10);

		
		if (!isNaN($diceNumber) && !isNaN($diceType) && $diceNumber <= 256) {	
			$invalidDicesArr = _splitAndParse($invalidDices, $diceType);
			for (var i = 0; i < $diceNumber; i++) {
				$throw.push(Math.floor(Math.random() * $diceType) + 1);
			}
			_showThrow($throw, $invalidDicesArr);
		}
		else {
			alert("Inserte un número de dados igual o inferior a 256");
		}		
	}
	function _paintTotal($storedTotals) {
		var $totalInt = 0,
		$total = document.getElementById('total');
		$total.value = $totalInt;
		for (var i = 0; i < $storedTotals.length; i++) {
			$totalInt += $storedTotals[i];
		}
		$total.value = $totalInt;
	}
	function _paintStoredDices($storedDices) {
		clearThrows();
		$firstColumn = document.getElementById("throws-10");
		$secondColumn = document.getElementById("throws-20");
		for (var i = 0; i < $storedDices.length; i++) {
			if (i < 10) $firstColumn.innerHTML += '<p class="throw-storaged">'+$storedDices[i]+'</p>';
			if (i >= 10) $secondColumn.innerHTML += '<p class="throw-storaged">'+$storedDices[i]+'</p>';
		}
	}	
	function _storageTotal($total, $storage = false) {
		var $storedTotals = JSON.parse(localStorage.getItem("storedTotals"));
		if ($storedTotals === null) $storedTotals = [];			
		if ($storage) { 
			if ($storedTotals.length === 20) $storedTotals.shift();	
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
		if ($storage) { 
			if ($storedDices.length === 20) $storedDices.shift();
			$storedDices.push($dices);		
		}
		else {
			$storedDices = [$dices];
		}		
		_paintStoredDices($storedDices);
		if ($storage) localStorage.setItem("storedDices",JSON.stringify($storedDices));
	}
	function clearThrows($storedDices) {
		$firstColumn = document.getElementById("throws-10");
		$secondColumn = document.getElementById("throws-20");
		$firstColumn.innerHTML = "";
		$secondColumn.innerHTML = "";
	}
	function cleanStoragedThrows() {
		clearThrows();
		localStorage.clear();
		window.location.reload();
	}
	$roll.addEventListener('click', rollDices);
	$clean.addEventListener('click', cleanStoragedThrows);
})();