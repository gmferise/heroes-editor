#!make
include .env

.PHONY: live
live:
	${CASC_EXE} "${HEROES_DATA_LIVE}" "*.xml" ./public/heroesxml
	${CASC_EXE} "${HEROES_DATA_LIVE}" "*.triggerlib" ./public/heroesxml
	${CASC_EXE} "${HEROES_DATA_LIVE}" "*.galaxy" ./public/heroesxml
	${CASC_EXE} "${HEROES_DATA_LIVE}" "*.txt" ./public/heroesxml
	@echo "Committing Build $$(cat public/heroesxml/mods/core.stormmod/base.stormdata/buildid.txt | cut -c2-)"
	@git restore --staged .
	@git add public/heroesxml
	@git commit -m "LIVE $$(cat public/heroesxml/mods/core.stormmod/base.stormdata/buildid.txt | cut -c2-)"

.PHONY: ptr
ptr:
	${CASC_EXE} "${HEROES_DATA_PTR}" "*.xml" ./public/heroesxml
	${CASC_EXE} "${HEROES_DATA_PTR}" "*.triggerlib" ./public/heroesxml
	${CASC_EXE} "${HEROES_DATA_PTR}" "*.galaxy" ./public/heroesxml
	${CASC_EXE} "${HEROES_DATA_PTR}" "*.txt" ./public/heroesxml
	@echo "Committing Build $$(cat public/heroesxml/mods/core.stormmod/base.stormdata/buildid.txt | cut -c2-)"
	@git restore --staged .
	@git add public/heroesxml
	@git commit -m "PTR $$(cat public/heroesxml/mods/core.stormmod/base.stormdata/buildid.txt | cut -c2-)"